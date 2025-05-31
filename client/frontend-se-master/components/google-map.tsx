"use client"

import { useState, useEffect } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import MapFallback from "./map-fallback"

type GoogleMapComponentProps = {
  latitude: number
  longitude: number
  name: string
  zoom?: number
  height?: string
}

export default function GoogleMapComponent({
  latitude,
  longitude,
  name,
  zoom = 15,
  height = "300px",
}: GoogleMapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [mapError, setMapError] = useState(false)

  // Get the API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  })

  useEffect(() => {
    setIsMounted(true)

    if (loadError) {
      console.error("Google Maps failed to load:", loadError)
      setMapError(true)
    }

    if (!apiKey) {
      console.warn("Google Maps API key is missing")
      setMapError(true)
    }
  }, [loadError, apiKey])

  // Handle server-side rendering
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted" style={{ height }}>
        <p className="text-center text-sm text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  // Show fallback if there's an error or no API key
  if (loadError || mapError || !apiKey) {
    return <MapFallback latitude={latitude} longitude={longitude} name={name} height={height} />
  }

  // Show loading state while the API is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted" style={{ height }}>
        <p className="text-center text-sm text-muted-foreground">Loading Google Maps...</p>
      </div>
    )
  }

  // Render the map once everything is ready
  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height,
        borderRadius: "0.5rem",
      }}
      center={{ lat: latitude, lng: longitude }}
      zoom={zoom}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
      }}
    >
      <Marker position={{ lat: latitude, lng: longitude }} title={name} />
    </GoogleMap>
  )
}
