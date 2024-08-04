import { NextResponse } from "next/server"
import { scrapeAndWriteToDB } from "@/libs"

export async function GET() {
    await scrapeAndWriteToDB();
    return NextResponse.json({ message: 'Cron'});

}