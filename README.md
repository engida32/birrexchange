# Next.js Location Mapping Application

This is a Next.js application that allows users to add, display, and manage locations on a map. The application uses PostgreSQL as the database and Prisma as the ORM. Docker is used to containerize the application and the database.

## Features

- Display a map using Leaflet and OpenStreetMap tiles
- Add locations by clicking on the map
- Save locations with names
- Display saved locations in a list
- Calculate and display a route connecting the locations
- Delete all saved locations

## Prerequisites

- Node.js
- Docker
- Docker Compose

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/engida32/Next_fullstack_location_test.git
   cd Next_fullstack_location_test
   ```

2. Create a `.env` file in the root directory with the following content:

   ```dotenv
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/testDB?schema=public"
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Docker Setup

1. Ensure the `Dockerfile` is in the root directory:

   ```dockerfile
   # Stage 1: Build the application
   FROM node:18-alpine AS builder

   WORKDIR /app

   # Copy package.json and package-lock.json to the container
   COPY package*.json ./

   # Install dependencies
   RUN npm install

   # Copy all files to the container
   COPY . .

   # Generate Prisma client
   RUN npx prisma generate

   # Build the application
   RUN npm run build

   # Stage 2: Run the application
   FROM node:18-alpine AS runner

   WORKDIR /app

   # Copy only the necessary files from the build stage
   COPY --from=builder /app/package*.json ./
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/prisma ./prisma

   # Set environment variables
   ENV NODE_ENV production

   # Expose the port the app runs on
   EXPOSE 3000

   # Start the application
   CMD ["npm", "start"]
   ```

2. Ensure the `docker-compose.yml` file is in the root directory:

   ```yaml
   version: "3.9"

   services:
   web:
     build: .
     ports:
       - "3000:3000"
     depends_on:
       db:
         condition: service_healthy
     environment:
       DATABASE_URL: postgresql://postgres:postgres@db:5432/testDB
     command: ["npm", "run", "start"]

   db:
     image: postgres:13
     ports:
       - "5433:5432"
     environment:
       POSTGRES_USER: postgres
       POSTGRES_PASSWORD: postgres
       POSTGRES_DB: testDB
     volumes:
       - postgres_data:/var/lib/postgresql/data
     healthcheck:
       test: ["CMD-SHELL", "pg_isready -U postgres"]
       interval: 5s
       timeout: 5s
       retries: 5

   volumes:
     postgres_data:
   ```

## Running the Application

1. Start the application using Docker Compose:

   ```bash
   docker-compose up
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## API Routes

- `GET /api/locations`: Retrieve all saved locations.
- `POST /api/locations`: Add a new location. Expects `name`, `latitude`, and `longitude` in the request body.
- `DELETE /api/locations`: Delete all saved locations.
- `GET /api/calculate-route`: Calculate and return a route connecting all saved locations.

## Prisma

Prisma is used as the ORM to interact with the PostgreSQL database. The Prisma schema is located in `prisma/schema.prisma`. Migrations and database interactions are handled by Prisma.

## Environment Variables

- `DATABASE_URL`: Connection string for the PostgreSQL database.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key for map-related features.

## Route Calculation Algorithm

The application uses the Haversine formula to calculate the distance between two points on the Earth given their latitude and longitude. This formula is implemented in the following function:

```typescript
function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon1 - lon2) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```
