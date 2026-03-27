import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import socket from "../components/Socket";
import L from "leaflet";
import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function ViewMap({ deliveryId, pickupLocation, destinationLocation }) {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [routeToPickup, setRouteToPickup] = useState([]);
  const [routePickupToDest, setRoutePickupToDest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref to track the last location we used to calculate a route (to avoid API spam)
  const lastRoutedPos = useRef(null);

  const API_KEY = import.meta.env.VITE_OPEN_SERVICE_API;

  // Helper: Calculate distance between two points in meters (Haversine formula)
  const getDistance = (pos1, pos2) => {
    if (!pos1 || !pos2) return 0;
    const R = 6371e3; // metres
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
      const query = `${address}, Nigeria`;
      
      // Fixed: Added the $ and the /search? path
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      
      console.log("Final Corrected URL:", url);

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'FarmDrive-App' 
        }
      });

      const data = await response.json();
      
      if (data && data.length > 0) {
        // Nominatim returns an array, so we take the first result [0]
        return { 
          lat: parseFloat(data[0].lat), 
          lng: parseFloat(data[0].lon) 
        };
      }
      return null;
    } catch (err) {
      console.error("Geocoding fetch failed", err);
      return null;
    }
  };

  useEffect(() => {
    const initLocations = async () => {
      setLoading(true);
      const pCoords = await geocodeAddress(pickupLocation);
      const dCoords = await geocodeAddress(destinationLocation);
      
      if (pCoords) setPickup([pCoords.lat, pCoords.lng]);
      if (dCoords) setDestination([dCoords.lat, dCoords.lng]);
      
      if (!pCoords || !dCoords) setError("Could not map one or more addresses.");
      setLoading(false);
    };
    initLocations();
  }, [pickupLocation, destinationLocation]);

  // SOCKET LISTENER
  useEffect(() => {
    if (!deliveryId) return;

    socket.emit("join_delivery", { delivery_id: deliveryId });

    socket.on("driver_moved", (data) => {
      const { lat, lng } = data;
      if (lat && lng) setDriverPos([lat, lng]);
    });

    return () => {
      socket.off("driver_moved");
    };
  }, [deliveryId]);

  // ROUTE: Pickup to Destination (Calculated once)
  useEffect(() => {
    if (!pickup || !destination) return;
    
    fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${pickup[1]},${pickup[0]}&end=${destination[1]},${destination[0]}`)
    .then(res => res.json())
    .then(data => {
      if (data.features && data.features[0]) {
        const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoutePickupToDest(coords);
      }
    }).catch(err => console.error("Static route error", err));
  }, [pickup, destination, API_KEY]);

  // ROUTE: Driver to Pickup (Smart Re-calculation)
  useEffect(() => {
    if (!driverPos || !pickup) return;

    // Only fetch if driver moved more than 500 meters from last routed position
    const distanceMoved = getDistance(driverPos, lastRoutedPos.current);
    
    if (!lastRoutedPos.current || distanceMoved > 500) {
      fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${driverPos[1]},${driverPos[0]}&end=${pickup[1]},${pickup[0]}`)
        .then(res => res.json())
        .then(data => {
          if (data.features) {
            const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            setRouteToPickup(coords);
            lastRoutedPos.current = driverPos; // Mark this as the last update
          }
        }).catch(err => console.error("Dynamic route error", err));
    }
  }, [driverPos, pickup, API_KEY]);

  if (loading) return <div className="map-placeholder">Loading locations...</div>;
  if (error) return <div className="map-error">{error}</div>;

  return (
    <MapContainer
      center={pickup || [9.0820, 8.6753]}
      zoom={12}
      style={{ height: "500px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; CartoDB'
        url="https://{s}://{z}/{x}/{y}{r}.png"
      />

      {pickup && (
        <Marker position={pickup}>
          <Popup><strong>Pickup:</strong> {pickupLocation}</Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={destination}>
          <Popup><strong>Destination:</strong> {destinationLocation}</Popup>
        </Marker>
      )}

      {driverPos && (
        <Marker position={driverPos}>
          <Popup>Driver is here</Popup>
        </Marker>
      )}

      {/* Blue Dashed Line: Destination Path */}
      {routePickupToDest.length > 0 && (
        <Polyline positions={routePickupToDest} pathOptions={{ color: "#3b82f6", weight: 3, dashArray: "5, 10" }} />
      )}

      {/* Orange Solid Line: Driver approaching Pickup */}
      {routeToPickup.length > 0 && (
        <Polyline positions={routeToPickup} pathOptions={{ color: "#f97316", weight: 5 }} />
      )}
    </MapContainer>
  );
}