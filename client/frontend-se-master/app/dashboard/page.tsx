"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import CustomerDashboard from "@/components/customer-dashboard"
import { getUserFromStorage } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Double-check authentication on page load
    const user = getUserFromStorage()
    if (!user || user.role !== "customer") {
      router.push("/")
    }
  }, [router])

  return <CustomerDashboard />
}
