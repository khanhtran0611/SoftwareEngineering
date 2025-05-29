"use client"

import Image from "next/image"
import CustomerSignupForm from "@/components/customer-signup-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image src="/tropical-beach-resort.png" alt="Tropical beach resort" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Join HusTravel</h2>
          <p className="text-lg opacity-90">Discover amazing destinations and create unforgettable memories</p>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Image src="/hustravel-logo.png" alt="HusTravel" width={120} height={40} className="mx-auto" />
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground">Start your journey with us today</p>
          </div>

          <CustomerSignupForm />
        </div>
      </div>
    </div>
  )
}
