"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserFromStorage } from "@/lib/auth"

export default function AdminDashboardLayout({
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

    // Check if user has admin role
    if (user.role !== "admin") {
      // Redirect to appropriate dashboard based on role
      if (user.role === "customer") {
        router.push("/dashboard")
      } else if (user.role === "hotelOwner") {
        router.push("/hotel/dashboard")
      } else {
        router.push("/")
      }
    }
  }, [router])

  return <>{children}</>
}
