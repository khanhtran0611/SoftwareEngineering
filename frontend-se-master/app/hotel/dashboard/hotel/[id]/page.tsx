"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserFromStorage } from "@/lib/auth"
import { getHotelById } from "@/lib/hotel"
import HotelDetails from "@/components/hotel-owner-hotel-details"
import type { Hotel } from "@/types/hotel"

export default function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const hotelId = Number.parseInt(resolvedParams.id, 10)
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchHotelData = async () => {
      // Check if user is logged in and is a hotel owner
      const user = getUserFromStorage()
      if (!user) {
        router.push("/")
        return
      }

      if (user.role !== "hotel owner") {
        router.push("/dashboard")
        return
      }

      try {
        // Sử dụng getHotelById thay vì mock data
        const hotelData = await getHotelById(hotelId)

        if (!hotelData) {
          setError('Hotel not found')
          router.push("/hotel/dashboard")
          return
        }

        setHotel(hotelData)
      } catch (err) {
        console.error('Error fetching hotel:', err)
        setError('Failed to load hotel details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotelData()
  }, [hotelId, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading hotel details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Hotel not found</p>
      </div>
    )
  }
  console.log(hotel)
  return <HotelDetails hotel={hotel} />
}
