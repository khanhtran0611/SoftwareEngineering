"use client"

import { useState, useEffect } from "react"
import HotelOwnerHeader from "@/components/hotel-owner-header"
import HotelOwnerNavigation from "@/components/hotel-owner-navigation"
import HotelsTable from "@/components/hotels-table"
import Footer from "@/components/footer"

export default function HotelOwnerDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Listen for search events from header
    const handleSearch = (event: CustomEvent) => {
      setSearchQuery(event.detail)
    }

    window.addEventListener("hotelsearch", handleSearch as EventListener)

    return () => {
      window.removeEventListener("hotelsearch", handleSearch as EventListener)
    }
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <HotelOwnerHeader />
      <div className="flex flex-1 overflow-hidden">
        <HotelOwnerNavigation />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4">
          <HotelsTable searchQuery={searchQuery} />
        </main>
      </div>
      <Footer />
    </div>
  )
}
