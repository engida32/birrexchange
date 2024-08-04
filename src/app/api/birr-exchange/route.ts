import { NextRequest, NextResponse } from 'next/server';
import { getAllExchangeRates, scrapeAndWriteToDB } from '@/libs';

export async function GET(req: NextRequest, res: NextResponse) {
    const rates = await getAllExchangeRates();
    if (!rates) {
        await scrapeAndWriteToDB();
    }
    return NextResponse.json({ rates })
}