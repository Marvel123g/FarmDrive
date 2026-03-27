import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import socket from "../components/Socket";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Marker Icons to distinguish between Farmer and Driver
const farmerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const driverIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function ViewFarmerLocation({ deliveryId, pickupLocation }) {
  const [pickup, setPickup] = useState(null); // Farmer
  const [driverPos, setDriverPos] = useState(null); // Driver (Initial + Moving)
  const [routeToPickup, setRouteToPickup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lastRoutedPos = useRef(null);
  const API_KEY = import.meta.env.VITE_OPEN_SERVICE_API;

  const getDistance = (pos1, pos2) => {
    if (!pos1 || !pos2) return 0;
    const R = 6371e3;
    const φ1 = (pos1[0] * Math.PI) / 180;
    const φ2 = (pos2[0] * Math.PI) / 180;
    const Δφ = ((pos2[0] - pos1[0]) * Math.PI) / 180;
    const Δλ = ((pos2[1] - pos1[1]) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const geocodeAddress = async (address) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", Nigeria")}&limit=1`;
      const response = await fetch(url, { headers: { 'User-Agent': 'FarmDrive-App' } });
      const data = await response.json();
      return data.length > 0 ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
    } catch (err) {
      return null;
    }
  };

  // 1. Initialize Locations (Farmer via Geocode + Driver via Geolocation)
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      // Get Farmer Position
      const coords = await geocodeAddress(pickupLocation);
      if (coords) setPickup([coords.lat, coords.lng]);
      else setError("Could not find farmer location.");

      // Get Driver Initial Position immediately
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDriverPos([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );

      setLoading(false);
    };
    init();
  }, [pickupLocation]);

  // 2. Socket: Listen for real-time movement updates
  useEffect(() => {
    if (!deliveryId) return;
    socket.emit("join_delivery", { delivery_id: deliveryId });

    socket.on("driver_moved", (data) => {
      console.log("Socket movement received:", data);
      if (data.lat && data.lng) {
        setDriverPos([data.lat, data.lng]);
      }
    });

    return () => socket.off("driver_moved");
  }, [deliveryId]);

  // 3. Routing: Update path when driver moves
  useEffect(() => {
    if (!driverPos || !pickup || !API_KEY) return;

    const distanceMoved = getDistance(driverPos, lastRoutedPos.current);
    
    // Update route if first load or moved > 200 meters
    if (!lastRoutedPos.current || distanceMoved > 200) {
      fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${driverPos[1]},${driverPos[0]}&end=${pickup[1]},${pickup[0]}`)
        .then(res => res.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            setRouteToPickup(coords);
            lastRoutedPos.current = driverPos;
          }
        }).catch(err => console.error("Routing error", err));
    }
  }, [driverPos, pickup, API_KEY]);

  if (loading) return <div className="map-placeholder">Initializing Map...</div>;
  if (error) return <div className="map-error">{error}</div>;

  return (
    <MapContainer
      center={driverPos || pickup || [9.0820, 8.6753]}
      zoom={13}
      style={{ height: "500px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 1. THE FARMER MARKER (Green) */}
      {pickup && (
        <Marker position={pickup} icon={farmerIcon}>
          <Popup><strong>Farmer (Pickup Point)</strong><br/>{pickupLocation}</Popup>
        </Marker>
      )}

      {/* 2 & 3. THE DRIVER MARKER (Blue - Current & Moving) */}
      {/* Note: Since driverPos updates via socket, this marker "moves" automatically */}
      {driverPos && (
        <Marker position={driverPos} icon={driverIcon}>
          <Popup><strong>Your Location</strong><br/>Tracking active...</Popup>
        </Marker>
      )}

      {/* THE ROUTE LINE */}
      {routeToPickup.length > 0 && (
        <Polyline positions={routeToPickup} pathOptions={{ color: "#f97316", weight: 5, opacity: 0.7 }} />
      )}
    </MapContainer>
  );
}