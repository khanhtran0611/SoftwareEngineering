"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { changePassword, resetPassword } from "@/lib/auth"
interface ResetPasswordFormProps {
    email: string  // Đổi từ number sang string vì params luôn là string
}

export default function ResetPasswordForm({ email }: ResetPasswordFormProps) {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (newPassword !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "Please make sure your passwords match.",
                variant: "destructive",
            })
            setIsLoading(false)
            return
        }

        try {
            console.log(decodeURIComponent(email))
            // Gọi API đổi mật khẩu với userId (email)
            const response = await resetPassword({
                email: decodeURIComponent(email),
                new_password: newPassword
            })

            if (response) {
                toast({
                    title: "Success!",
                    description: "Your password has been reset. Please login with your new password.",
                })
                router.push('/') // Về trang login
            } else {
                throw new Error('Failed to reset password')
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reset password. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">Reset Password</h3>
                <p className="text-sm text-muted-foreground">
                    Enter a new password for account: <span className="font-medium">{decodeURIComponent(email)}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>

            <div className="text-center">
                <Link href="/" className="text-sm text-primary hover:underline">
                    <ArrowLeft className="mr-2 inline-block h-4 w-4" />
                    Back to Login
                </Link>
            </div>
        </div>
    )
}
