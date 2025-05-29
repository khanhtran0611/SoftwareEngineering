"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import FavoriteDestinationCard from "@/components/favorite-destination-card"
import { getUserFavoriteDestinations, removeDestinationFromFavorites } from "@/lib/loving-list"
import { getUserFromStorage } from "@/lib/auth"
import type { Destination } from "@/types/destination"
import { Heart } from "lucide-react"
import Link from "next/link"
import type { User } from "@/types/user"
import { getDestinationById } from "@/lib/destination"

export default function FavoritesPage() {
  const [favoriteDestinations, setFavoriteDestinations] = useState<Destination[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Get current user
        const user = getUserFromStorage()
        if (user) {
          setCurrentUser(user)

          // Load favorites from LovingList database
          const favoriteList = await getUserFavoriteDestinations(user.user_id)

          // Sửa lại phần này để lấy destinationId từ mỗi object trong mảng
          const favoritesPromises = favoriteList.map(item => getDestinationById(item.destination_id))
          const favorites = await Promise.all(favoritesPromises)

          setFavoriteDestinations(favorites)
        }
      } catch (error) {
        console.error('Error loading favorites:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const removeFavorite = async (destinationId: number) => {
    if (currentUser) {
      try {
        // Remove from database
        await removeDestinationFromFavorites(currentUser.user_id, destinationId)

        // Update local state
        setFavoriteDestinations((prev) => prev.filter((dest) => dest.destination_id !== destinationId))
      } catch (error) {
        console.error('Error removing favorite:', error)
        // Có thể thêm toast thông báo lỗi ở đây
      }
    }
  }

  // Empty handlers for Header component (no search/filter functionality needed)
  const handleSearch = () => { }
  const handleFilter = () => { }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} onFilter={handleFilter} />
        <div className="flex">
          <Navigation />
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl">
              <div className="animate-pulse space-y-4">
                <div className="h-8 w-64 bg-gray-200 rounded" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  // Show login message if user is not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} onFilter={handleFilter} />
        <div className="flex">
          <Navigation />
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl">
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h3>
                <p className="text-gray-600 mb-6">You need to be logged in to view your favorite places.</p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} onFilter={handleFilter} />

      <div className="flex">
        <Navigation />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                <h1 className="text-3xl font-bold text-gray-900">Favorite Places</h1>
              </div>
              <p className="text-gray-600">
                Your collection of loved destinations - places you want to visit and explore.
              </p>
            </div>

            {favoriteDestinations.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorite Places Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start exploring destinations and click the heart icon to add them to your favorites.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Explore Destinations
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">{favoriteDestinations.length} favorite places</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favoriteDestinations.map((destination) => (
                    <FavoriteDestinationCard
                      key={destination.destination_id}
                      destination={destination}
                      onRemoveFavorite={removeFavorite}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
