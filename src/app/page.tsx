"use client";
import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const GoogleMapAndLocations = dynamic(
  () => import("@/component/GoogleMapContainer"),
  { ssr: false }
);
const MapAndLocations = dynamic(() => import("@/component/MapContianer"), {
  ssr: false,
});
export default function Home() {
  const [useGoogleMap, setUseGoogleMap] = useState(true);
  if (typeof window === "undefined") return;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Head>
        <title>Location Mapper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ width: "100%", maxWidth: "80%", padding: "20px" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          Location Mapper
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: useGoogleMap ? "#007bff" : "#ccc",
              color: useGoogleMap ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => setUseGoogleMap(true)}
          >
            Google Maps
          </button>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: !useGoogleMap ? "#007bff" : "#ccc",
              color: !useGoogleMap ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => setUseGoogleMap(false)}
          >
            Leaflet
          </button>
        </div>
        <div style={{ width: "100%", height: "400px" }}>
          {useGoogleMap ? <GoogleMapAndLocations /> : <MapAndLocations />}
        </div>
      </main>
    </div>
  );
}
