"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset email sending
    setTimeout(() => {
      setIsEmailSent(true)
      setIsLoading(false)

      toast({
        title: "Reset email sent!",
        description: "Please check your email for password reset instructions.",
      })
    }, 2000)
  }

  const handleResendEmail = () => {
    setIsLoading(true)

    // Simulate resending email
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Email resent!",
        description: "Please check your email again.",
      })
    }, 1000)
  }

  if (isEmailSent) {
    return (
      <div className="space-y-6 pt-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Didn't receive the email? Check your spam folder or try again.
          </p>

          <Button variant="outline" onClick={handleResendEmail} disabled={isLoading} className="w-full">
            {isLoading ? "Resending..." : "Resend Email"}
          </Button>
        </div>

        <div className="pt-4">
          <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Forgot your password?</h3>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="reset-email"
            type="email"
            placeholder="your@email.com"
            required
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>

      <div className="text-center">
        <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </form>
  )
}
