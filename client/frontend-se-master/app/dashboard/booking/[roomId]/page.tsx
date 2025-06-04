"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BookingForm from "@/components/booking-form"
import { getRoomById } from "@/lib/rooms"
import { getUserFromStorage } from "@/lib/auth"

type PageProps = {
  params: Promise<{ roomId: string }>
}

export default function ReservationPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const roomId = Number.parseInt(resolvedParams.roomId, 10)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      // Check if user is logged in
      const user = getUserFromStorage()
      if (!user) {
        router.push("/")
        return
      }

      // Check if room exists
      try {
        const room = await getRoomById(roomId)
        if (!room) {
          router.push("/dashboard")
          return
        }

        // Check if room is available
        if (!room.availability) {
          router.push(`/dashboard/hotel/${room.hotel_id}`)
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error loading room:', error)
        router.push("/dashboard")
      }
    }

    loadData()
  }, [roomId, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading reservation form...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Error loading room details. Please try again.</p>
      </div>
    )
  }

  return <BookingForm roomId={roomId} />
}
