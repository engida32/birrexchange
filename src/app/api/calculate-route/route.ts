export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import distance from "@/utils/distance"
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const locations = await prisma.location.findMany()

  if (locations.length === 0) {
    return NextResponse.json([])
  }

  let route = [locations[0]]
  let remaining = locations.slice(1)

  while (remaining.length > 0) {
    let currentLocation = route[route.length - 1]
    let nearestIndex = 0
    let nearestDistance = Infinity

    for (let i = 0; i < remaining.length; i++) {
      let d = distance(currentLocation.latitude, currentLocation.longitude,
        remaining[i].latitude, remaining[i].longitude)
      if (d < nearestDistance) {
        nearestDistance = d
        nearestIndex = i
      }
    }

    route.push(remaining[nearestIndex])
    remaining.splice(nearestIndex, 1)
  }

  return NextResponse.json(route)
}