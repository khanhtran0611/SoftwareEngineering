"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserFromStorage } from "@/lib/auth"

export default function HotelDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = getUserFromStorage()
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/")
      return
    }

    // Check if user has hotel owner role
    if (user.role !== "hotel owner") {
      // Redirect to appropriate dashboard based on role
      if (user.role === "customer") {
        router.push("/dashboard")
      } else if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
    }
  }, [router])

  return <>{children}</>
}
