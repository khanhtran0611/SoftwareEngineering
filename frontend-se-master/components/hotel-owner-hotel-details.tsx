"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, MapPin, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RoomsTable from "@/components/rooms-table"
import ManageHotelFacilities from "@/components/manage-hotel-facilities"
import Footer from "@/components/footer"
import MapFallback from "@/components/map-fallback"
import { calculateAverageRating } from "@/lib/reviews"
import type { Hotel } from "@/types/hotel"

type HotelDetailsProps = {
  hotel: Hotel
}

export default function HotelDetails({ hotel }: HotelDetailsProps) {
  const router = useRouter()
  const [averageRating, setAverageRating] = useState<number | null>(hotel.rating)

  useEffect(() => {
    // Update the average rating
    setAverageRating(calculateAverageRating(hotel.hotel_id))
  }, [hotel.hotel_id])
  console.log(averageRating)
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <div onClick={() => router.push("/hotel/dashboard")} className="flex items-center gap-1 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </div>
            </Button>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-3xl font-bold">{hotel.name}</h1>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium">
                  {typeof averageRating === 'number' ? averageRating : "No reviews"}
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
                  src={hotel.thumbnail || "/hotel-placeholder.png"}
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
                  Bali. {averageRating !== null ? `With a rating of ${averageRating.toFixed(1)} stars, this` : "This"}{" "}
                  hotel provides excellent service and amenities for guests.
                </p>
                <p className="mt-4">
                  For reservations or inquiries, please contact the hotel directly at {hotel.contact_phone}.
                </p>
              </div>
            </Card>

            {/* Tabs for Rooms and Facilities */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="rooms">
                  <TabsList>
                    <TabsTrigger value="rooms">Rooms</TabsTrigger>
                    <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  </TabsList>
                  <TabsContent value="rooms" className="mt-6">
                    <RoomsTable hotelId={hotel.hotel_id} searchQuery="" />
                  </TabsContent>
                  <TabsContent value="facilities" className="mt-6">
                    <ManageHotelFacilities hotelId={hotel.hotel_id} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
