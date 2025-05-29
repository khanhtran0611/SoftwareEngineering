"use client"

import Image from "next/image"
import ForgotPasswordForm from "@/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image src="/tanah-lot-sunset.png" alt="Tanah Lot sunset" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Reset Your Password</h2>
          <p className="text-lg opacity-90">Get back to exploring amazing destinations</p>
        </div>
      </div>

      {/* Right side - Forgot password form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Image src="/hustravel-logo.png" alt="HusTravel" width={120} height={40} className="mx-auto" />
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
