/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const GoogleMapAndLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [route, setRoute] = useState<Location[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const arrowsRef = useRef<google.maps.Marker[]>([]);
  const [tempLatLng, setTempLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 51.505, lng: -0.09 },
          zoom: 13,
        });
        googleMapRef.current = map;

        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            setTempLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          }
        });
      }
    });

    fetchLocations();
  }, []);

  useEffect(() => {
    if (googleMapRef.current) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      locations.forEach((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: googleMapRef.current as google.maps.Map,
          title: location.name,
        });
        markersRef.current.push(marker);
      });
    }
  }, [locations]);
  useEffect(() => {
    if (googleMapRef.current) {
      // Clear existing polyline and arrows
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      arrowsRef.current.forEach((arrow) => arrow.setMap(null));
      arrowsRef.current = [];

      if (route.length > 0) {
        const path = [...route, route[0]].map((loc) => ({
          lat: loc.latitude,
          lng: loc.longitude,
        }));

        // Create new polyline with arrows
        polylineRef.current = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: googleMapRef.current,
          icons: [
            {
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 3,
              },
              offset: "50%",
              repeat: "100px",
            },
          ],
        });

        // Fit the map to the route bounds
        const bounds = new google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point));
        googleMapRef.current.fitBounds(bounds);
      }
    }
  }, [route]);
  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations");
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLocations = async () => {
    const response = await fetch("/api/locations", {
      method: "DELETE",
    });
    if (response.ok) {
      setLocations([]);
      setRoute([]);
    } else {
      alert("Failed to delete locations");
    }
  };

  const handleLocationAdded = async () => {
    if (newLocationName.trim() === "" || !tempLatLng) {
      alert("Please enter a name for the location and click on the map");
      return;
    }

    const response = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newLocationName,
        latitude: tempLatLng.lat,
        longitude: tempLatLng.lng,
      }),
    });

    if (response.ok) {
      setNewLocationName("");
      setTempLatLng(null);
      fetchLocations();
    } else {
      alert("Failed to add location");
    }
  };

  const calculateRoute = async () => {
    const response = await fetch("/api/calculate-route");
    if (response.ok) {
      const calculatedRoute = await response.json();
      setRoute(calculatedRoute);
    } else {
      alert("Failed to calculate route");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ flex: 2, padding: "20px", boxSizing: "border-box" }}>
        <div
          ref={mapRef}
          style={{
            height: "60%",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder="Enter location name"
            style={{
              width: "calc(50% - 120px)",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginRight: "10px",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleLocationAdded}
            disabled={!tempLatLng}
            style={{
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#0070f3",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
          >
            Add Location
          </button>
          <p
            style={{
              marginTop: "10px",
              fontSize: "14px",
              lineHeight: "1.5",
              fontWeight: "400",
              textDecoration: "underline",
              color: "#0070f3",
            }}
          >
            Click on the map to select a location, then enter a name and click
            'Add Location'
          </p>
          <button
            onClick={calculateRoute}
            disabled={locations.length < 2}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#0070f3",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
              marginRight: "10px",
            }}
          >
            Calculate Route
          </button>
          <button
            onClick={deleteLocations}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#e63946",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
          >
            Delete Saved Locations
          </button>
          <p style={{ marginTop: "10px", fontSize: "14px", lineHeight: "1.5" }}>
            Click calculate route to see the shortest path that visits all saved
            locations
          </p>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: "20px",
          boxSizing: "border-box",
          borderLeft: "1px solid #ddd",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
          Saved Locations
        </h2>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {locations.map((location) => (
            <li
              key={location.id}
              style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}
            >
              {location.name} ({location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)})
            </li>
          ))}
        </ul>
        {route.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
              Calculated Route
            </h3>
            <ol style={{ paddingLeft: "20px" }}>
              {route.map((location, index) => (
                <li key={index} style={{ marginBottom: "5px" }}>
                  {location.name}
                </li>
              ))}
              <li style={{ marginTop: "5px", fontWeight: "bold" }}>
                {route[0].name} (back to start)
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapAndLocations;
