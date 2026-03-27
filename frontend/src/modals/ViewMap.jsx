import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import socket from "../components/Socket";
import L from "leaflet";

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
  const [initialLocation, setInitialLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(false);

  const API_KEY = import.meta.env.VITE_OPEN_SERVICE_API;

  // Function to geocode address to coordinates
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      throw new Error(`Could not geocode address: ${address}`);
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  // Geocode pickup and destination addresses
  useEffect(() => {
    const geocodeLocations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (pickupLocation) {
          const pickupCoords = await geocodeAddress(pickupLocation);
          if (pickupCoords) {
            setPickup([pickupCoords.lat, pickupCoords.lng]);
            console.log("Geocoded pickup:", pickupLocation, "->", pickupCoords);
          } else {
            setError(`Could not find coordinates for pickup location: ${pickupLocation}`);
          }
        }
        
        if (destinationLocation) {
          const destCoords = await geocodeAddress(destinationLocation);
          if (destCoords) {
            setDestination([destCoords.lat, destCoords.lng]);
            console.log("Geocoded destination:", destinationLocation, "->", destCoords);
          } else {
            setError(`Could not find coordinates for destination: ${destinationLocation}`);
          }
        }
      } catch (err) {
        setError("Error geocoding locations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    geocodeLocations();
  }, [pickupLocation, destinationLocation]);

  // SOCKET LISTENER
  useEffect(() => {
    if (!deliveryId) return;

    socket.emit("join_delivery", { delivery_id: deliveryId });

    socket.on("driver_moved", (data) => {
      const { lat, lng } = data;
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        setDriverPos([lat, lng]);
        
        if (!initialLocation && lat && lng) {
          setInitialLocation([lat, lng]);
        }
      }
    });

    return () => {
      socket.off("driver_moved");
    };
  }, [deliveryId]);

  // FETCH ROUTES
  useEffect(() => {
    if (!pickup || !destination) return;
    
    const fetchPickupToDestinationRoute = async () => {
      try {
        const res = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${pickup[1]},${pickup[0]}&end=${destination[1]},${destination[0]}`
        );
        const data = await res.json();
        
        if (data.features && data.features[0]) {
          const coords = data.features[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setRoutePickupToDest(coords);
        }
      } catch (err) {
        console.log("Route error (pickup to destination):", err);
      }
    };

    fetchPickupToDestinationRoute();
  }, [pickup, destination]);

  useEffect(() => {
    if (!driverPos || !pickup) return;
    
    const fetchDriverToPickupRoute = async () => {
      try {
        const res = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${driverPos[1]},${driverPos[0]}&end=${pickup[1]},${pickup[0]}`
        );
        const data = await res.json();
        
        if (data.features && data.features[0]) {
          const coords = data.features[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setRouteToPickup(coords);
        }
      } catch (err) {
        console.log("Route error (driver to pickup):", err);
      }
    };

    fetchDriverToPickupRoute();
  }, [driverPos, pickup]);

  const getMapCenter = () => {
    if (pickup && destination) {
      return [(pickup[0] + destination[0]) / 2, (pickup[1] + destination[1]) / 2];
    }
    if (pickup) return pickup;
    if (driverPos) return driverPos;
    return [9.0820, 8.6753];
  };
  
  if (loading) {
    return (
      <div style={{ height: "500px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", borderRadius: "12px" }}>
        <div style={{ textAlign: "center" }}>
          <p>Loading map...</p>
          <p style={{ fontSize: "12px", marginTop: "10px", color: "#666" }}>
            Geocoding: {pickupLocation} → {destinationLocation}
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ height: "500px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", borderRadius: "12px" }}>
        <div style={{ textAlign: "center", color: "#dc2626" }}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  const mapCenter = getMapCenter();

  return (
    <MapContainer
      center={mapCenter}
      zoom={8}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      touchZoom={true}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        background: "#f0f0f0" // Fallback background
      }}
      whenReady={() => console.log("Map is ready")}
    >
        <TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB'
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
/>

      {/* Markers */}
      {initialLocation && !isNaN(initialLocation[0]) && !isNaN(initialLocation[1]) && (
        <Marker position={initialLocation}>
          <Popup>Initial Location (Start)</Popup>
        </Marker>
      )}

      {pickup && !isNaN(pickup[0]) && !isNaN(pickup[1]) && (
        <Marker position={pickup}>
          <Popup>
            <strong>Pickup Location</strong><br/>
            {pickupLocation}
          </Popup>
        </Marker>
      )}

      {destination && !isNaN(destination[0]) && !isNaN(destination[1]) && (
        <Marker position={destination}>
          <Popup>
            <strong>Destination Location</strong><br/>
            {destinationLocation}
          </Popup>
        </Marker>
      )}

      {driverPos && !isNaN(driverPos[0]) && !isNaN(driverPos[1]) && (
        <Marker position={driverPos}>
          <Popup>Driver Current Location</Popup>
        </Marker>
      )}

      {/* Routes */}
      {routePickupToDest.length > 0 && (
        <Polyline
          positions={routePickupToDest}
          pathOptions={{ color: "#3b82f6", weight: 4, opacity: 0.7, dashArray: "10, 10" }}
        />
      )}

      {routeToPickup.length > 0 && (
        <Polyline
          positions={routeToPickup}
          pathOptions={{ color: "#f97316", weight: 5, opacity: 0.9 }}
        />
      )}
    </MapContainer>
  );
}