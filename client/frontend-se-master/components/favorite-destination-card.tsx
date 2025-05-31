"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Star, Heart, MapPin, DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Destination } from "@/types/destination"

type FavoriteDestinationCardProps = {
  destination: Destination
  onRemoveFavorite: (destinationId: number) => void
}

export default function FavoriteDestinationCard({ destination, onRemoveFavorite }: FavoriteDestinationCardProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const router = useRouter()

  const handleRemoveFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRemoving(true)

    // Add a small delay for better UX
    setTimeout(() => {
      onRemoveFavorite(destination.destination_id)
    }, 300)
  }

  const handleCardClick = () => {
    router.push(`/dashboard/destination/${destination.destination_id}`)
  }

  return (
    <Card
      className={cn(
        "h-full overflow-hidden transition-all hover:shadow-lg cursor-pointer",
        isRemoving && "opacity-50 scale-95",
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={destination.thumbnail ? `${destination.thumbnail}` : "/placeholder.svg"}
            alt={destination.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFavorite}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </Button>

          {/* Destination type badge */}
          <div className="absolute left-2 top-2">
            <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-800 backdrop-blur-sm">
              {destination.type}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg leading-tight">{destination.name}</h3>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{destination.location}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{destination.entry_fee === 0 ? "Free" : `${destination.entry_fee.toLocaleString()} ₫`}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{destination.description}</p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{destination.rating}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/dashboard/destination/${destination.destination_id}`)
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
