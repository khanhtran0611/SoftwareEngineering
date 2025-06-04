"use client"

import Image from "next/image"
import HotelOwnerSignupForm from "@/components/hotel-owner-signup-form"

export default function HotelRegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image src="/bali-resort-pool.png" alt="Luxury resort pool" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-8 left-8 text-white max-w-md">
          <h2 className="text-3xl font-bold mb-4">Partner with HusTravel</h2>
          <div className="space-y-2 text-lg opacity-90">
            <p>• Reach millions of travelers</p>
            <p>• Increase your bookings</p>
            <p>• Professional support team</p>
            <p>• Easy property management</p>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Image src="/hustravel-logo.png" alt="HusTravel" width={120} height={40} className="mx-auto mb-6" />
          </div>

          <HotelOwnerSignupForm />
        </div>
      </div>
    </div>
  )
}
