"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { getUserFromStorage, removeUserFromStorage } from "@/lib/auth"
import { removeDestinationsFromStorage } from "@/lib/destination"

type AdminHeaderProps = {
  onSearch: (query: string) => void
}

export default function AdminHeader({ onSearch }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [userName, setUserName] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = getUserFromStorage()
    if (user) {
      setUserName(user.name)
    }
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleLogout = () => {
    removeUserFromStorage()
    removeDestinationsFromStorage()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="relative h-12 w-12 overflow-hidden">
            <Image src="/hustravel-logo.png" alt="HusTravel Logo" width={48} height={48} className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold">HusTravel</span>
            <span className="text-xs text-muted-foreground">Admin Dashboard</span>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4 md:justify-center">
          <form onSubmit={handleSearchSubmit} className="relative hidden w-full max-w-md md:block">
            <Input
              type="search"
              placeholder="Search destinations..."
              className="pr-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-2">
          {userName && <span className="hidden text-sm md:inline-block">Hello, {userName}</span>}
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
