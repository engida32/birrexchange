import * as cheerio from 'cheerio';
import axios from 'axios';
import { SELECTORS } from '@/utils/constants';
import { BankExchangeRate, BankExchangeRateResponse, ExchangeRateResponse } from '@/types';
import prisma from './prisma';


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
                    selling_price: Number(sellingPrice)
                });
            });
        });

        // write to DB
        for (const rate of currencyRates) {
            await prisma.exchangeRate.create({
                data: {
                    bank_name: rate.bank_name,
                    bank_logo: rate.bank_logo,
                    buying_price: rate.buying_price,
                    selling_price: rate.selling_price,
                    currency_name: rate.currency_name
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
    // filter our currency and rates from d/t banks
    const bankExchangeRates = await prisma.exchangeRate.findMany({
        select: {
            bank_name: true,
            bank_logo: true,
            currency_name: true,
            buying_price: true,
            selling_price: true
        },
        orderBy: {
            bank_name: 'asc'
        },
        distinct: ['bank_name']
    });

    const response: BankExchangeRateResponse[] = [];
    bankExchangeRates.forEach(rate => {
        response.push({
            currency_name: rate.currency_name,
            currency_logo: rate.currency_name,
            rates: bankExchangeRates.filter(r => r.currency_name === rate.currency_name)
        });
    });

    return {
        banks: response,
        binance: [{
            currency_name: 'USD',
            buying_price: 0,
            selling_price: 0
        }]
    }
   } catch (error) {
    return {
        banks: [],
        binance: []
    }
   }
}