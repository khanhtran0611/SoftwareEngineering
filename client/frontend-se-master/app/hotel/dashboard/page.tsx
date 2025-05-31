"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import HotelOwnerDashboard from "@/components/hotel-owner-dashboard"
import { getUserFromStorage } from "@/lib/auth"

export default function HotelOwnerDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Double-check authentication on page load
    const user = getUserFromStorage()
    if (!user || user.role !== "hotel owner") {
      router.push("/")
    }
  }, [router])

  return <HotelOwnerDashboard />
}
