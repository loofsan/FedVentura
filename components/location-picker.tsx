"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationPickerProps {
  onLocationChange: (
    location: string,
    coords?: { lat: number; lng: number }
  ) => void;
  initialLocation?: string;
}

export function LocationPicker({
  onLocationChange,
  initialLocation = "",
}: LocationPickerProps) {
  const [location, setLocation] = useState<string>(initialLocation);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = () => {
    setDetecting(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Using Nominatim (OpenStreetMap) for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );

          if (!response.ok) {
            throw new Error("Failed to get location details");
          }

          const data = await response.json();

          // Better error handling for the response
          if (data.error) {
            throw new Error(data.error);
          }

          // Extract location details with better fallbacks
          const address = data.address || {};
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.suburb ||
            address.municipality;
          const state =
            address.state || address.county || address.state_district;
          const country = address.country;

          // Create location string
          let locationString = "";
          if (city && state) {
            locationString = `${city}, ${state}`;
          } else if (city) {
            locationString = city;
          } else if (state) {
            locationString = state;
          } else {
            locationString = country || "Unknown location";
          }

          setLocation(locationString);
          onLocationChange(locationString, { lat: latitude, lng: longitude });
        } catch (err) {
          console.error(
            "Error getting location details:",
            err instanceof Error ? err.message : "Unknown error"
          );
          setError("Could not determine your location");
        } finally {
          // IMPORTANT: Always set detecting to false whether success or error
          setDetecting(false);
        }
      },
      (geoError) => {
        // Handle geolocation errors properly
        let errorMessage = "Location access denied or unavailable";

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case geoError.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = `Location error: ${geoError.message}`;
        }

        console.error("Geolocation error:", {
          code: geoError.code,
          message: geoError.message,
        });

        setError(errorMessage);
        setDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Auto-detect on mount if no initial location
  useEffect(() => {
    if (!initialLocation && typeof window !== "undefined") {
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        detectLocation();
      }, 100);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-700 font-medium block truncate">
          {location || "Click to detect location"}
        </span>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
      <Button
        onClick={detectLocation}
        variant="outline"
        size="sm"
        disabled={detecting}
        className="whitespace-nowrap flex-shrink-0"
      >
        {detecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            Detecting...
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 mr-1" />
            {location ? "Update" : "Detect"} Location
          </>
        )}
      </Button>
    </div>
  );
}
