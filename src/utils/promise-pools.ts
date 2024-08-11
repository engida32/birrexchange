import { PromisePool } from '@supercharge/promise-pool';
import axios from 'axios';
import {BINANCE_HEADER as headers, BINANCE_BODY as data} from "./constants"


export async function p2pAverageSellingAndBuyingPrice():Promise<number[]> {
    try {
        const binanceURL = process.env.BINANCE_URL as string;
        const tradeTypes = ["SELL", "BUY"];

        const {results, errors} = await PromisePool
            .for(tradeTypes)
            .process(async (tradeType) => {
                return axios.post(binanceURL, {...data, tradeType}, {headers});
            });

            if (errors.length) {
                throw new Error("Error fetching data from Binance");
            }

            // find the average price
            const averageSellingPrice = results[0].data.data.reduce((acc: number, curr: { adv: { price: any; }; }) => acc + Number(curr.adv.price), 0) / results[0].data.data.length;
            const averageBuyingPrice = results[1].data.data.reduce((acc:number, curr: { adv: { price: any; }; }) => acc + Number(curr.adv.price), 0) / results[1].data.data.length;

            return [averageBuyingPrice , averageSellingPrice];
    }
    catch (error) {
        console.log('PromisePool Error:', error)
        return []
    } 
}
