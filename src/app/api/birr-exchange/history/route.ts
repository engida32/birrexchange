import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { getExchangeRateHistory } from '@/libs';

export async function POST(req: NextRequest,  res: NextApiResponse) {
    try {
        const params = req.nextUrl.searchParams 
        const time_range = params.get('time_range');
        const currency_name = params.get('currency_name');
        if (!time_range || !currency_name) {
            res.statusCode = 400;
            return NextResponse.json({ error: 'Invalid time_range or currency_name' });
        }
        const history = await getExchangeRateHistory(currency_name as string,time_range as string);
        return NextResponse.json(history);
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        return NextResponse.json({ error: 'Internal server error' })
    }
}