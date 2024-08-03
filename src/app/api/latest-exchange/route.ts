import { PrismaClient } from "@prisma/client/extension";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const rates = await prisma.exchangeRate.findMany({
    orderBy: { date: 'desc' },
    take: 1,
  });
  if (!rates) {
    return NextResponse.json({ error: 'Exchange rates not found' }, { status: 404 });
  }
  return NextResponse.json(rates);
}
