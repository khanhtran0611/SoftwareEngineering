"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HotelOwnerBookingsTable from "@/components/hotel-owner-bookings-table"
import HotelOwnerHeader from "@/components/hotel-owner-header"
import HotelOwnerNavigation from "@/components/hotel-owner-navigation"
import Footer from "@/components/footer"

export default function HotelOwnerBookings() {
  return (
    <div className="min-h-screen flex flex-col">
      <HotelOwnerHeader />

      <div className="flex flex-1">
        <HotelOwnerNavigation />

        <main className="flex-1 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Manage Bookings</h1>
                <p className="text-muted-foreground">View and manage customer reservations for your hotels</p>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Bookings</CardTitle>
                <CardDescription>All customer reservations for your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <HotelOwnerBookingsTable />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
