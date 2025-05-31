"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import HotelFacilities from "@/components/hotel-facilities"
import MapFallback from "@/components/map-fallback"
import ReviewForm from "@/components/review-form"
import ReviewSection from "@/components/review-section"
import RoomCarousel from "@/components/room-carousel"
import { getUserFromStorage } from "@/lib/auth"
import { calculateAverageRating } from "@/lib/reviews"
import type { Hotel } from "@/types/hotel"

type HotelDetailsProps = {
  hotel: Hotel
}

export default function HotelDetails({ hotel }: HotelDetailsProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshReviews, setRefreshReviews] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check user login
        const user = getUserFromStorage()
        setIsLoggedIn(!!user)

        // Get average rating
        const rating = await calculateAverageRating(hotel.hotel_id)
        setAverageRating(rating)
      } catch (error) {
        console.error('Error loading hotel data:', error)
        setAverageRating(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [hotel.hotel_id, refreshReviews])

  const handleReviewAdded = () => {
    setRefreshReviews((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading hotel details...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to destinations
          </Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-medium">
              {averageRating !== null ? averageRating.toFixed(1) : "No reviews"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{hotel.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>{hotel.contact_phone}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Image and Location Map side by side */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative h-[300px] overflow-hidden rounded-lg md:col-span-2 md:h-[400px]">
            <Image
              src={hotel.thumbnail || "/placeholder.svg"}
              alt={hotel.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="md:col-span-1">
            <div className="h-full">
              <h2 className="mb-2 text-lg font-bold">Location</h2>
              <MapFallback
                latitude={hotel.latitude}
                longitude={hotel.longitude}
                name={hotel.name}
                height="calc(100% - 30px)"
              />
            </div>
          </div>
        </div>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold">About {hotel.name}</h2>
          <p className="mb-6 text-muted-foreground">{hotel.description}</p>

          <div className="prose max-w-none">
            <p>
              {hotel.name} is located in {hotel.address}, offering comfortable accommodations for travelers visiting
              Bali.{" "}
              {averageRating !== null
                ? `With a rating of ${averageRating.toFixed(1)} stars, this hotel provides excellent service and amenities for guests.`
                : "This hotel provides excellent service and amenities for guests."}
            </p>
            <p className="mt-4">
              For reservations or inquiries, please contact the hotel directly at {hotel.contact_phone}.
            </p>
          </div>
        </Card>

        {/* Hotel Facilities Section */}
        <Card className="p-6">
          <HotelFacilities hotelId={hotel.hotel_id} />
        </Card>

        {/* Room Carousel Section */}
        <Card className="p-6">
          <RoomCarousel hotelId={hotel.hotel_id} />
        </Card>

        {/* Write a Review Section (only for logged-in users) */}
        {isLoggedIn && (
          <div className="space-y-4">
            <ReviewForm hotelId={hotel.hotel_id} onReviewAdded={handleReviewAdded} />
          </div>
        )}

        {/* Reviews Section */}
        <Card className="p-6">
          <ReviewSection hotelId={hotel.hotel_id} averageRating={averageRating} refreshTrigger={refreshReviews} />
        </Card>
      </div>
    </div>
  )
}
