import * as cheerio from 'cheerio';
import axios from 'axios';
import { SELECTORS, TIME_RANGES } from '@/utils/constants';
import { BankExchangeRate, BankExchangeRateResponse, ExchangeRateResponse,  BankExchangeRateLatestAndLast, BinanceExchangeRateResponse, BankExchangeRateHistoryResponse, BinanceExchangeRate, ExchangeRateHistoryResponse} from '@/types';
import prisma from './prisma';
import { fetchFromCache, setToCache } from './cache';
import { p2pAverageSellingAndBuyingPrice } from '@/utils/promise-pools';


/**
 * Scrapper and write daily rate of all currencies [USD, EUR, GBP, AED]
 * By each banks [CBE, BAO]
 * @returns {Promise<ExchangeRate[]>} - List of exchange rates
 */
export async function scrapeAndWriteToDB(): Promise<BankExchangeRate[]> {
    // check if the db is connected
    if (!prisma) {
        console.log('Prisma is not connected');
        return [];
    }
    const forExURL = process.env.FOREX_URL as string;

    try {
        const {data: forExHTML} = await axios.get(forExURL);
        const $ = cheerio.load(forExHTML);
        const $currencyLists = $(SELECTORS.EXC_CURRENCY_LIST);
        const $currencyCard = $currencyLists.find(SELECTORS.EXC_CURRENCY_CARD);
        const currencyRates: BankExchangeRate[] = [];

        $currencyCard.each((_, card) => {
            const $card = $(card);
            const currencyName = $card.find(SELECTORS.CARD_HEADER).find('span').text().trim();
            const $currencyRows = $card.find('tbody').find('tr');
            $currencyRows.each((_, row) => {
                const $row = $(row);
                const bankName = $row.find(SELECTORS.CURRENCY_BANK_LOGO).find('img').prop('alt') as string;
                const bankLogo = $row.find(SELECTORS.CURRENCY_BANK_LOGO).find('img').prop('data-src') as string;
                const buyingPrice = $row.find('td').eq(1).text().trim();
                const sellingPrice = $row.find('td').eq(2).text().trim();

                currencyRates.push({
                    bank_name: bankName,
                    bank_logo: bankLogo,
                    currency_name: currencyName,
                    buying_price: Number(buyingPrice),
                    selling_price: Number(sellingPrice),
                    is_last_rate: false,
                    is_latest_rate: true
                });
            });
        });

        // Binance find the best rate for USDT
        const binanceData:BinanceExchangeRate[] = []
        const [averageBuyingPrice, averageSellingPrice] = await p2pAverageSellingAndBuyingPrice();
        binanceData.push({
            buying_price: averageBuyingPrice,
            selling_price: averageSellingPrice,
            currency_name: 'USD',
            is_last_rate: false,
            is_latest_rate: true
        })    

        // update previous bank rates
        const previousRates = await prisma.bankExchangeRate.findMany({
            where: {
                OR: [
                    {is_last_rate: true},
                    {is_latest_rate: true}
                ]
            }
        });

        const lastRates = previousRates.find(rate => rate.is_last_rate);
        if (lastRates) {
            await prisma.bankExchangeRate.update({
                where: {
                    id: lastRates.id
                },
                data: {
                    is_last_rate: false
                }
            })
        }

        const latestRates = previousRates.find(rate => rate.is_latest_rate);
        if (latestRates) {
            await prisma.bankExchangeRate.update({
                where: {
                    id: latestRates.id
                },
                data: {
                    is_latest_rate: false,
                    is_last_rate: true
                }
            })
        }


        // write to DB
        for (const rate of currencyRates) {
            await prisma.bankExchangeRate.create({
                data: {
                    bank_name: rate.bank_name,
                    bank_logo: rate.bank_logo,
                    buying_price: rate.buying_price,
                    selling_price: rate.selling_price,
                    currency_name: rate.currency_name,
                    is_last_rate: rate.is_last_rate,
                    is_latest_rate: rate.is_latest_rate
                }
            });
        }

        // update previous binance rates
        const previousBinanceRates = await prisma.binanceExchangeRate.findMany({
            where: {
                OR: [
                    {is_last_rate: true},
                    {is_latest_rate: true}
                ]
            }
        });

        const lastBinanceRates = previousBinanceRates.find(rate => rate.is_last_rate);
        if (lastBinanceRates) {
            await prisma.binanceExchangeRate.update({
                where: {
                    id: lastBinanceRates.id
                },
                data: {
                    is_last_rate: false
                }
            })
        }

        const latestBinanceRates = previousBinanceRates.find(rate => rate.is_latest_rate);
        if (latestBinanceRates) {
            await prisma.binanceExchangeRate.update({
                where: {
                    id: latestBinanceRates.id
                },
                data: {
                    is_latest_rate: false,
                    is_last_rate: true
                }
            })
        }

       
        // write to DB
        for (const rate of binanceData) {
            await prisma.binanceExchangeRate.create({
                data: {
                    buying_price: rate.buying_price,
                    selling_price: rate.selling_price,
                    currency_name: rate.currency_name,
                    is_last_rate: rate.is_last_rate,
                    is_latest_rate: rate.is_latest_rate
                }
            });
        }
        
        return currencyRates
    } catch (error) {
        console.log('Error: ', error);
        return [];
    }
}


/**
 * Get all exchange rates
 * @returns {Promise<ExchangeRate[]>} - List of exchange rates
 */
export async function getAllExchangeRates(): Promise<ExchangeRateResponse | null> {
   try { 
    
    // fetch from cache if available
    const cacheKey = 'exchange_rates'+ new Date().toDateString();
    const cacheData = fetchFromCache(cacheKey);
    
    const banksResponse: BankExchangeRateResponse[] = [];
    const binanceResponse: BinanceExchangeRateResponse[] = [];

    if (cacheData){
        banksResponse.push(...cacheData.banks);
    }else {
        // get all bank rates
        const currencyNames = await prisma.bankExchangeRate.findMany({
            distinct: ['currency_name']
        });

        for (const currency of currencyNames) {
            const bankRates = await prisma.bankExchangeRate.findMany({
                where: {
                    currency_name: currency.currency_name,
                    OR: [
                        {is_last_rate: true},
                        {is_latest_rate: true}
                    ]
                },
                orderBy: {
                    bank_name: 'asc'
                },
                distinct: ['bank_name']
            });

            const banks: BankExchangeRateLatestAndLast[] = [];
            for (const bank of bankRates) {
                // find last and latest rates
                let lastRate = await prisma.bankExchangeRate.findFirst({
                    where: {
                        bank_name: bank.bank_name,
                        currency_name: bank.currency_name,
                        is_last_rate: true
                    }
                });

                const latestRate = await prisma.bankExchangeRate.findFirst({
                    where: {
                        bank_name: bank.bank_name,
                        currency_name: bank.currency_name,
                        is_latest_rate: true
                    }
                });

                if (!lastRate) {lastRate = latestRate}
                banks.push({
                    bank_name: bank.bank_name,
                    bank_logo: bank.bank_logo,
                    rates: [
                        {
                            buying_price: lastRate?.buying_price as number,
                            selling_price: lastRate?.selling_price as number
                        },
                        {
                            buying_price: latestRate?.buying_price as number,
                            selling_price: latestRate?.selling_price as number
                        }
                    ]
                });
            }

            banksResponse.push({
                currency_name: currency.currency_name,
                currency_logo: currency.currency_name.toLowerCase() + '.png',
                rates: banks
            });
        }
    }

    // get binance rates
    const binanceRates = await prisma.binanceExchangeRate.findMany({
        where: {
            OR: [
                {is_last_rate: true},
                {is_latest_rate: true}
            ]
        }
    });

    let lastBinanceRates = binanceRates.find(rate => rate.is_last_rate);
    const latestBinanceRates = binanceRates.find(rate => rate.is_latest_rate);
    if (!lastBinanceRates) {
        lastBinanceRates = latestBinanceRates;
    }

    binanceResponse.push({
        currency_name: 'USD',
        currency_logo: "USD".toLowerCase() + '.png',
        rates: [
            {
                buying_price: lastBinanceRates?.buying_price as number,
                selling_price: lastBinanceRates?.selling_price as number
            },
            {
                buying_price: latestBinanceRates?.buying_price as number,
                selling_price: latestBinanceRates?.selling_price as number
            }
        ]
    });

    // set to cache, to expire in 6 hrs
    const duration = 6 * 60 * 60 * 1000;
    setToCache(cacheKey, {
        banks: banksResponse
    }, duration);

    return {
        banks: banksResponse,
        binance: binanceResponse
    }
   } catch (error) {
    return null
   }
}

/**
 * Get exchange rate history by currency name
 * by time range of [week, month, year]
 */
export async function getExchangeRateHistory(currency_name: string, time_range: string): Promise<ExchangeRateHistoryResponse | null > {
    try {
        if (!TIME_RANGES[time_range as keyof typeof TIME_RANGES] || !currency_name) {
            throw new Error('Invalid time range or currency name');
        }

        const now = new Date();
        let startDate = new Date();
        switch (time_range) {
            case '1D':
                startDate.setDate(now.getDate() - 1);
                break;
            case '1W':
                startDate.setDate(now.getDate() - 7);
                break;
            case '1M':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case '3M':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case '6M':
                startDate.setMonth(now.getMonth() - 6);
                break;
            case '1Y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 1);
                break;
        }

        const cacheKey = 'exchange_rate_history_' + currency_name + '_' + time_range;
        const cacheData = fetchFromCache(cacheKey);
        if (cacheData) return cacheData

        // banks exchange rate history
        const bankRates = await prisma.bankExchangeRate.findMany({
            where: {
                currency_name: currency_name,
                created_at: {
                    gte: startDate,
                    lte: now
                }
            },
            orderBy: {
                bank_name: 'asc'
            },
            distinct: ['created_at']
        });

        // binance exchange rate history
        const binanceRates = await prisma.binanceExchangeRate.findMany({
            where: {
                currency_name: currency_name,
                created_at: {
                    gte: startDate,
                    lte: now
                }
            },
            orderBy: {
                created_at: 'asc'
            },
            distinct: ['created_at']
        });

        let bankRatesResponse: BankExchangeRateResponse = {
            currency_name: currency_name,
            currency_logo: currency_name.toLowerCase() + '.png',
            rates: []
        }
        let binanceRatesResponse: BinanceExchangeRateResponse= {
            currency_name: currency_name,
            currency_logo: currency_name.toLowerCase() + '.png',
            rates: []
        }

        // format the bank rates
        bankRates.reduce((acc, rate) => {
            const bank = acc.find(bank => bank.bank_name === rate.bank_name);
            if (bank) {
                bank.rates.push({
                    buying_price: rate.buying_price,
                    selling_price: rate.selling_price,
                    created_at: rate.created_at
                });
            } else {
                acc.push({
                    bank_name: rate.bank_name,
                    bank_logo: rate.bank_logo,
                    rates: [
                        {
                            buying_price: rate.buying_price,
                            selling_price: rate.selling_price,
                            created_at: rate.created_at
                        }
                    ]
                });
            }
            return acc;
        }, bankRatesResponse.rates);

        // format the binance rates
        binanceRates.reduce((acc, rate) => {
            acc.push({
                buying_price: rate.buying_price,
                selling_price: rate.selling_price,
                created_at: rate.created_at
            });
            return acc;
        }, binanceRatesResponse.rates);

        const response: ExchangeRateHistoryResponse = {
            time_range: time_range,
            rates: {
                banks: bankRatesResponse,
                binance: binanceRatesResponse
            }
        }
        const duration = 6 * 60 * 60 * 1000;
        setToCache(cacheKey, response , duration);

        return response
    } catch (error) {
        console.log('Error: ', error);
        return null 
    }
}