"use client"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Truck, Coins, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import HotelCarousel from "@/components/hotel-carousel"
import ImageSlider from "@/components/image-slider"
import MapFallback from "@/components/map-fallback"
import DestinationReviewSection from "@/components/destination-review-section"
import { hotels } from "@/data/hotels"
import { getDestinationImages } from "@/lib/images"
import { findNearbyHotels } from "@/lib/distance"
import { calculateDestinationAverageRating, getDestinationReviews } from "@/lib/destination-reviews"
import { formatVND } from "@/lib/currency"
import type { Destination } from "@/types/destination"
import { useState, useEffect } from "react"
import type { Hotel } from "@/types/hotel"
import type { DestinationImage } from "@/types/image"
import { getAllHotels } from "@/lib/hotel"

type DestinationDetailsProps = {
  destination: Destination
}

export default function DestinationDetails({ destination }: DestinationDetailsProps) {
  const [averageRating, setAverageRating] = useState<number>(0)
  const [reviewCount, setReviewCount] = useState<number>(0)
  const [nearbyHotels, setNearbyHotels] = useState<Hotel[]>([])
  const [destinationImages, setDestinationImages] = useState<DestinationImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch tất cả dữ liệu cần thiết
        const [rating, reviews, hotels, images] = await Promise.all([
          calculateDestinationAverageRating(destination.destination_id),
          getDestinationReviews(destination.destination_id),
          getAllHotels(),
          getDestinationImages(destination.destination_id)
        ])

        setAverageRating(rating)
        setReviewCount(reviews.length)

        // Tìm khách sạn gần đó
        const nearby = await findNearbyHotels(
          destination.latitude,
          destination.longitude,
          hotels,
          30
        )
        setNearbyHotels(nearby)
        setDestinationImages(images)
        
      } catch (error) {
        console.error('Error fetching destination details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [destination.destination_id, destination.latitude, destination.longitude])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading destination details...</p>
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

        <div className="flex flex-wrap items-start gap-4">
          <h1 className="text-3xl font-bold">{destination.name}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{destination.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {averageRating > 0 ? (
              <span>
                {averageRating.toFixed(1)} rating ({reviewCount} reviews)
              </span>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            <span>{destination.transportation}</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4" />
            <span>Entry fee: {destination.entry_fee === 0 ? "Free" : formatVND(destination.entry_fee)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>Type: {destination.type}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Image Slider and Location Map side by side */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <ImageSlider images={destinationImages} title={`Photos of ${destination.name}`} />
          </div>

          <div className="md:col-span-1">
            <div className="h-full">
              <h2 className="mb-2 text-lg font-bold">Location</h2>
              <MapFallback
                latitude={destination.latitude}
                longitude={destination.longitude}
                name={destination.name}
                height="calc(100% - 30px)"
              />
            </div>
          </div>
        </div>
        {/* {destination.travel_type.toLowerCase()} */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold">About {destination.name}</h2>
          <p className="mb-6 text-muted-foreground">{destination.description}</p>

          <div className="prose max-w-none">
            <p>
              {destination.name} is one of the most popular destinations in {destination.location}, attracting visitors
              from all around the world. The ...
              offers a unique experience that showcases the natural beauty and cultural heritage of Bali.
            </p>
            <p className="mt-4">
              Visitors can easily reach {destination.name} via {destination.transportation.toLowerCase()}. The entry fee
              is {destination.entry_fee === 0 ? "free" : formatVND(destination.entry_fee)}.
            </p>
          </div>
        </Card>

        {/* Nearby Hotels Carousel */}
        <div className="mt-12">
          <HotelCarousel hotels={nearbyHotels} title={`Hotels near ${destination.name} (${nearbyHotels.length})`} />
        </div>

        {/* Destination Reviews Section */}
        <div className="mt-12">
          <DestinationReviewSection destinationId={destination.destination_id} />
        </div>
      </div>
    </div>
  )
}
