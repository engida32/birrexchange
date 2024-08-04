import * as cheerio from 'cheerio';
import axios from 'axios';
import { SELECTORS } from '@/utils/constants';
import { BankExchangeRate, BankExchangeRateResponse, ExchangeRateResponse,  BankExchangeRateLatestAndLast, BinanceExchangeRateResponse} from '@/types';
import prisma from './prisma';
import { fetchFromCache, setToCache } from './cache';


/**
 * Scrapper and write daily rate of all currencies [USD, EUR, GBP, AED]
 * By each banks [CBE, BAO]
 * @returns {Promise<ExchangeRate[]>} - List of exchange rates
 */
export async function scrapeAndWriteToDB(): Promise<BankExchangeRate[]> {
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

        // find all last rates and set them to false
        const lastRates = await prisma.bankExchangeRate.findMany({
            where: {
                is_last_rate: true,
                is_latest_rate: false
            }
        });

        // update last rates
        for (const rate of lastRates) {
            await prisma.bankExchangeRate.update({
                where: {
                    id: rate.id
                },
                data: {
                    is_last_rate: false
                }
            });
        }

        // find all previous rates
        const previousRates = await prisma.bankExchangeRate.findMany({
            where: {
                is_latest_rate: true,
                is_last_rate: false
            }
        });

        // update previous rates
        for (const rate of previousRates) {
            await prisma.bankExchangeRate.update({
                where: {
                    id: rate.id
                },
                data: {
                    is_latest_rate: false,
                    is_last_rate: true
                }
            });
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
export async function getAllExchangeRates(): Promise<ExchangeRateResponse> {
   try { 
    
    // fetch from cache if available
    const cacheKey = 'exchange_rates'+ new Date().toDateString();
    const cacheData = fetchFromCache(cacheKey);
    if (cacheData) return cacheData

    const banksResponse: BankExchangeRateResponse[] = [];
    const binanceResponse: BinanceExchangeRateResponse[] = [];

    // get all currency names
    const currencyNames = await prisma.bankExchangeRate.findMany({
        distinct: ['currency_name']
    });

    for (const currency of currencyNames) {
        const bankRates = await prisma.bankExchangeRate.findMany({
            where: {
                currency_name: currency.currency_name
            }
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

        // get binance rates
        const binanceRates = await prisma.binanceExchangeRate.findMany({
            where: {
                currency_name: currency.currency_name
            }
        });

        const binance: BinanceExchangeRateResponse[] = [];
        for (const binanceRate of binanceRates) {
            // find last and latest rates
            let lastRate = await prisma.binanceExchangeRate.findFirst({
                where: {
                    currency_name: binanceRate.currency_name,
                    is_last_rate: true
                }
            });

            const latestRate = await prisma.binanceExchangeRate.findFirst({
                where: {
                    currency_name: binanceRate.currency_name,
                    is_latest_rate: true
                }
            });

            if (!lastRate) {lastRate = latestRate}
            binance.push({
                currency_name: currency.currency_name,
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
    }

    // set to cache, to expire in 6 hrs
    const duration = 6 * 60 * 60 * 1000;
    setToCache(cacheKey, {
        banks: banksResponse,
        binance: binanceResponse
    }, duration);
    return {
        banks: banksResponse,
        binance: binanceResponse
    }
   } catch (error) {
    return {
        banks: [],
        binance: []
    }
   }
}