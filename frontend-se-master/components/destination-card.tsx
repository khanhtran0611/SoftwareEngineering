"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Star, Heart } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { calculateDestinationAverageRating, getDestinationReviews } from "@/lib/destination-reviews"
import { isDestinationFavorited, addDestinationToFavorites, removeDestinationFromFavorites } from "@/lib/loving-list"
import { getUserFromStorage } from "@/lib/auth"
import type { Destination } from "@/types/destination"
import type { User } from "@/types/user"
// import type { DestinationReview } from "@/types/destination-review"

type DestinationCardProps = {
  destination: Destination
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [averageRating, setAverageRating] = useState<number>(0)
  const [reviewCount, setReviewCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch rating và review count
  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        setIsLoading(true)
        // Lấy rating và reviews cùng lúc
        const [rating, reviews] = await Promise.all([
          calculateDestinationAverageRating(destination.destination_id),
          getDestinationReviews(destination.destination_id)
        ])

        // Kiểm tra nếu reviews không undefined trước khi lấy length
        setAverageRating(rating)
        setReviewCount(reviews?.length || 0) // Sử dụng optional chaining và fallback về 0
      } catch (error) {
        console.error('Error fetching rating data:', error)
        setAverageRating(0)
        setReviewCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRatingData()
  }, [destination.destination_id])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!currentUser) {
      router.push("/")
      return
    }

    try {
      if (isFavorite) {
        await removeDestinationFromFavorites(currentUser.user_id, destination.destination_id)
      } else {
        await addDestinationToFavorites(currentUser.user_id, destination.destination_id)
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Có thể thêm toast thông báo lỗi ở đây
    }
  }

  const handleCardClick = () => {
    router.push(`/dashboard/destination/${destination.destination_id}`)
  }

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const user = getUserFromStorage()
      if (user) {
        try {
          setCurrentUser(user)
          const isFav = await isDestinationFavorited(user.user_id, destination.destination_id)
          setIsFavorite(isFav)
        } catch (error) {
          console.error('Error checking favorite status:', error)
        }
      }
    }

    checkFavoriteStatus()
  }, [destination.destination_id])

  if (isLoading) {
    return (
      <Card className="h-full overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200" />
        <div className="p-4 space-y-2">
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={destination.thumbnail ? `${destination.thumbnail}` : "/placeholder.svg"}
            alt={destination.name}
            fill
            className="object-cover"
          />
          <button
            onClick={toggleFavorite}
            className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-gray-500")} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-bold">{destination.name}</h3>
        <p className="text-sm text-muted-foreground">{destination.location}</p>
        <p className="mt-2 line-clamp-3 text-sm">{destination.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-1">
          {averageRating > 0 ? (
            <>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{averageRating}</span>
              <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No reviews yet</span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
