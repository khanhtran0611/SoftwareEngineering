"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"
import { getUserFromStorage } from "@/lib/auth"

export default function AdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Double-check authentication on page load
    const user = getUserFromStorage()
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [router])

  return <AdminDashboard />
}
