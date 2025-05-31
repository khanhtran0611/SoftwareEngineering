"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { authenticateUser, saveUserToStorage } from "@/lib/auth"

export default function HotelOwnerLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("hotel@example.com") // Pre-filled with mock account
  const [password, setPassword] = useState("hotel123") // Pre-filled with mock password
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await authenticateUser(email, password)

      if (user && user.role === "hotel owner") {
        // Save user to localStorage
        saveUserToStorage(user)

        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        })

        // Redirect to hotel owner dashboard
        router.push("/hotel/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-2">
        <Label htmlFor="hotel-email">Business Email</Label>
        <div className="relative">
          <Input
            id="hotel-email"
            type="email"
            placeholder="your-business@hotel.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="hotel-password">Password</Label>
          <Link href="/hotel/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="hotel-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="hotel-remember" />
        <Label htmlFor="hotel-remember" className="text-sm font-normal">
          Remember me for 30 days
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in as Hotel Owner"}
      </Button>

      <div className="text-center text-sm">
        Not registered yet?{" "}
        <Link href="/hotel/register" className="text-primary hover:underline">
          Register your property
        </Link>
      </div>
    </form>
  )
}
