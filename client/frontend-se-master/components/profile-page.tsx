"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ProfileForm from "@/components/profile-form"
import { getUserFromStorage } from "@/lib/auth"
import type { User } from "@/types/user"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getUserFromStorage()
    if (!currentUser) {
      router.push("/")
      return
    }

    setUser(currentUser)
  }, [router])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header onSearch={() => {}} onFilter={() => {}} />
        <div className="flex flex-1 flex-col md:flex-row">
          <Navigation />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <p>Loading profile information...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearch={() => {}} onFilter={() => {}} />
      <div className="flex flex-1 flex-col md:flex-row">
        <Navigation />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-3xl">
            <ProfileForm user={user} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
