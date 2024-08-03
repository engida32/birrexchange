"use client";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const MapEvents = ({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapAndLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [route, setRoute] = useState<Location[]>([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations");
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        alert("Failed to fetch locations");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const deleteLocations = async () => {
    try {
      const response = await fetch("/api/locations", {
        method: "DELETE",
      });
      if (response.ok) {
        setLocations([]);
      } else {
        alert("Failed to delete locations");
      }
    } catch (error) {
      console.error("Error deleting locations:", error);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
  };

  const handleAddLocation = async () => {
    if (!selectedLocation) {
      alert("Please select a location on the map first");
      return;
    }
    if (newLocationName.trim() === "") {
      alert("Please enter a name for the location");
      return;
    }

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLocationName,
          latitude: selectedLocation[0],
          longitude: selectedLocation[1],
        }),
      });

      if (response.ok) {
        setNewLocationName("");
        setSelectedLocation(null);
        fetchLocations();
      } else {
        alert("Failed to add location");
      }
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const calculateRoute = async () => {
    try {
      const response = await fetch("/api/calculate-route");
      if (response.ok) {
        const calculatedRoute = await response.json();
        setRoute(calculatedRoute);
      } else {
        alert("Failed to calculate route");
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%" }}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: "600px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapEvents onMapClick={handleMapClick} />
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              title={location.name}
              icon={L.icon({
                iconUrl:
                  "https://cdn.mapmarker.io/api/v1/pin?size=20&hoffset=1&voffset=-1&color=%23d00&icon=fas.fa-map-marker-alt",
                iconSize: [28, 25],
                iconAnchor: [14, 25],
                popupAnchor: [0, -25],
              })}
            />
          ))}
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              icon={L.icon({
                iconUrl:
                  "https://cdn.mapmarker.io/api/v1/pin?size=20&hoffset=1&voffset=-1&color=%230070f3&icon=fas.fa-map-marker-alt",
                iconSize: [28, 25],
                iconAnchor: [14, 25],
                popupAnchor: [0, -25],
              })}
            />
          )}
          {route.length > 0 && (
            <Polyline
              positions={[...route, route[0]].map((loc) => [
                loc.latitude,
                loc.longitude,
              ])}
              color="red"
            />
          )}
        </MapContainer>
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
            onClick={handleAddLocation}
            disabled={!selectedLocation || !newLocationName.trim()}
            style={{
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              backgroundColor:
                selectedLocation && newLocationName ? "#0070f3" : "#ccc",
              color: "#fff",
              cursor: selectedLocation ? "pointer" : "not-allowed",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
          >
            Add Location
          </button>
          <p>
            Click on the map to select a location, then enter a name and click
            <strong> Add Location</strong>
          </p>
          <button
            onClick={calculateRoute}
            style={{
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
        </div>
      </div>
      <div style={{ width: "30%", padding: "20px" }}>
        <h2>Saved Locations</h2>
        <ul>
          {locations.map((location) => (
            <li key={location.id}>
              {location.name} ({location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)})
            </li>
          ))}
        </ul>
        {route.length > 0 && (
          <div>
            <h3>Calculated Route</h3>
            <ol>
              {[...route, route[0]].map((location, index) => (
                <li key={index}>{location.name}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapAndLocations;
