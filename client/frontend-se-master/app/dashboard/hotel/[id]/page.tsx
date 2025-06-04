"use client"

import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { getHotelById } from "@/lib/hotel"
import HotelDetails from "@/components/hotel-details"
import type { Hotel } from "@/types/hotel"

export default function HotelPage({ params }: { params: Promise<{ id: string }> }) {
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const hotelId = Number.parseInt(resolvedParams.id, 10)

  useEffect(() => {
    const loadHotelData = async () => {
      try {
        const hotelData = await getHotelById(hotelId)
        if (!hotelData) {
          notFound()
        }
        setHotel(hotelData)
      } catch (error) {
        console.error('Error fetching hotel:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    loadHotelData()
  }, [hotelId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading hotel details...</p>
      </div>
    )
  }

  if (!hotel) {
    return notFound()
  }

  return <HotelDetails hotel={hotel} />
}
