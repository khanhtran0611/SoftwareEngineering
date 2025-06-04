"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import ResetPasswordForm from "@/components/reset-password-form"

export default function ResetPasswordPage() {
    const params = useParams()
    const email = params.id as string // Thêm type assertion để đảm bảo là string

    // Thêm check để tránh undefined
    if (!email) {
        return <div>Invalid reset password link</div>
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardContent className="pt-6">
                    <ResetPasswordForm email={email} />
                </CardContent>
            </Card>
        </div>
    )
}
