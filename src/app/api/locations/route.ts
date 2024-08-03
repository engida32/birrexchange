import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
interface Location {
  name: string
  latitude: number
  longitude: number
}
//get all locations
export async function GET(request: NextRequest) {
  const locations = await prisma.location.findMany()
  if (!locations) {
    return NextResponse.json({ error: 'Locations not found' }, { status: 404 })
  }
  return NextResponse.json(locations)
}

//create a new location
export async function POST(request: NextRequest) {
  try {
    const { name, latitude, longitude }: Location
      = await request.json();

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields: name, latitude, longitude' }, { status: 400 });
    }

    const location = await prisma.location.create({
      data: { name, latitude, longitude },
    });

    return NextResponse.json(location, { status: 201 });

  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
//delete all locations
export async function DELETE(request: NextRequest) {
  try {
    await prisma.location.deleteMany();
    return NextResponse.json({ message: 'All locations deleted' });
  } catch (error) {
    console.error('Error deleting locations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
