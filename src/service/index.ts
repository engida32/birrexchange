import {load} from 'cheerio';
import axios from 'axios';
import { SELECTORS } from '@/utils/constants';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
/**
 * Scrapper and write daily rate of all currencies [USD, EUR, GBP, AED]
 * By each banks [CBE, BAO]
 */
export async function scrapeAndWriteToDB() {
    const FOREX_URL = process.env.FOREX_URL as string;
    try {
        const {data: forexDOM} = await axios.get(FOREX_URL);
        const $ = load(forexDOM);
        const currencyList = $(SELECTORS.EXC_CURRENCY_LIST);
        const currencyRates = [];
        currencyList.each((_, currency) => {
            const currencyCard = $(currency).find(SELECTORS.EXC_CURRENCY_CARD);
            const cardHeader = currencyCard.find(SELECTORS.CARD_HEADER).text();
            const currencyBankLogo = currencyCard.find(SELECTORS.CURRENCY_BANK_LOGO).attr('src');
            const currencyBankName = currencyCard.find(SELECTORS.CURRENCY_BANK_NAME).text();
            const currencyBankBuying = currencyCard.find(SELECTORS.CURRENCY_BANK_BUYING).text();
            const currencyBankSelling = currencyCard.find(SELECTORS.CURRENCY_BANK_SELLING).text();
            currencyRates.push({
                cardHeader,
                currencyBankLogo,
                currencyBankName,
                currencyBankBuying,
                currencyBankSelling
            });
        });
    } catch (error) {
        console.log('Error: ', error);
        return [];
    }
}


