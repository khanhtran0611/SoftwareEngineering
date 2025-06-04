"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BookingsList from "@/components/bookings-list"
import { getUserFromStorage } from "@/lib/auth"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function BookingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = getUserFromStorage()
    if (!user) {
      router.push("/")
      return
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearch={() => {}} onFilter={() => {}} />
      <div className="flex flex-1 flex-col md:flex-row">
        <Navigation />
        <main className="flex-1 p-4 md:p-6">
          <BookingsList />
        </main>
      </div>
      <Footer />
    </div>
  )
}
