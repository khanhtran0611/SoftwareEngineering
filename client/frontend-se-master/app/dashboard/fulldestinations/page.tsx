"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import CustomerDashboard2 from "@/components/customer-dashboard2"
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

  return <CustomerDashboard2 />
}
