"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Filter, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getUserFromStorage, removeUserFromStorage } from "@/lib/auth"
import { formatVND } from "@/lib/currency"
import { removeDestinationsFromStorage } from "@/lib/destination"

type HeaderProps = {
  onSearch: (query: string) => void
  onFilter: (filters: { minPrice: number; maxPrice: number; location: string }) => void
}

export default function Header({ onSearch, onFilter }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("10000000")
  const [location, setLocation] = useState("")
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

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setMinPrice(value)
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setMaxPrice(value)
  }

  const applyFilters = () => {
    onFilter({
      minPrice: Number.parseInt(minPrice || "0", 10),
      maxPrice: Number.parseInt(maxPrice || "10000000", 10),
      location: location.trim(),
    })

    toast({
      title: "Filters applied",
      description: "Your destination filters have been applied.",
    })
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
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative h-12 w-12 overflow-hidden">
            <Image src="/hustravel-logo.png" alt="HusTravel Logo" width={48} height={48} className="object-contain" />
          </div>
          <span className="text-xl font-bold">HusTravel</span>
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Destinations</SheetTitle>
                <SheetDescription>Adjust filters to find your perfect destination</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Price Range (VND)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-price">Min Price</Label>
                      <Input
                        id="min-price"
                        type="text"
                        placeholder="0"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-price">Max Price</Label>
                      <Input
                        id="max-price"
                        type="text"
                        placeholder="10,000,000"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                      />
                    </div>
                  </div>
                  {minPrice && maxPrice && (
                    <p className="text-xs text-muted-foreground">
                      Price range: {formatVND(Number.parseInt(minPrice))} - {formatVND(Number.parseInt(maxPrice))}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter location (e.g., Badung, Tabanan)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Hello, {userName}</span>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
