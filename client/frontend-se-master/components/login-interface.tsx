"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomerLoginForm from "./customer-login-form"
import AdminLoginForm from "./admin-login-form"
import HotelOwnerLoginForm from "./hotel-owner-login-form"

export default function LoginInterface() {
  const [activeTab, setActiveTab] = useState("customer")

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Travel Image (60%) */}
      <div className="relative h-64 w-full md:h-auto md:w-3/5">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/golden-bridge-danang.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/40">
            <div className="p-8 text-white">
              <h1 className="text-3xl font-bold">HusTravel</h1>
              <p className="mt-2">Discover Vietnam's wonders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Options (40%) */}
      <div className="flex w-full items-center justify-center bg-white p-8 md:w-2/5">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="hotelOwner">Hotel Owner</TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <CustomerLoginForm />
            </TabsContent>
            <TabsContent value="admin">
              <AdminLoginForm />
            </TabsContent>
            <TabsContent value="hotelOwner">
              <HotelOwnerLoginForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
