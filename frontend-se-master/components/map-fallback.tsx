import { MapPin } from "lucide-react"

type MapFallbackProps = {
  latitude: number
  longitude: number
  name: string
  height?: string
}

export default function MapFallback({ latitude, longitude, name, height = "300px" }: MapFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-4" style={{ height }}>
      <MapPin className="mb-2 h-6 w-6 text-primary" />
      <h3 className="text-center text-base font-medium">{name}</h3>
      <p className="text-center text-xs text-muted-foreground">
        {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </p>
      <div className="mt-2 text-center">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  )
}
