"use client"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Hotel } from "@/types/hotel"
import { calculateAverageRating } from "@/lib/review2"
import { useEffect } from "react"
import { useState } from "react"

type HotelCardProps = {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const [averageRating, setAverageRating] = useState<number | null>(null)
  useEffect(() => {
    const fetchAverageRating = async () => {
      const averageRating = await calculateAverageRating(hotel.hotel_id)
      setAverageRating(averageRating)
    }
    fetchAverageRating()
  }, [hotel.hotel_id])
  
  return (
    <Link href={`/dashboard/hotel/${hotel.hotel_id}`} className="block h-full">
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-40 w-full">
          <Image src={hotel.thumbnail || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold">{hotel.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{hotel.address}</p>
          <div className="mt-2 flex items-center gap-1">
            {averageRating !== null ? (
              <>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{averageRating}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">No reviews</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">{hotel.description}</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
