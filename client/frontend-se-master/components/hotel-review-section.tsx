"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import HotelReviewCard from "@/components/hotel-review-card"
import HotelReviewForm from "@/components/hotel-review-form"
// import { getHotelReviews, calculateAverageRating } from "@/lib/reviews"
import { getMyReviews, calculateAverageRating } from "@/lib/review2"
import type { Review } from "@/types/review"

type HotelReviewSectionProps = {
  hotelId: number
}

export default function HotelReviewSection({ hotelId }: HotelReviewSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load reviews and rating
  const loadReviewData = async () => {
    try {
      const [reviewsData, ratingData] = await Promise.all([
        getMyReviews(hotelId),
        calculateAverageRating(hotelId)
      ])
      setReviews(reviewsData)
      setAverageRating(ratingData)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh reviews when a new review is added
  const handleReviewAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  // Load initial data and refresh when needed
  useEffect(() => {
    loadReviewData()
  }, [hotelId, refreshTrigger])

  // Show only 3 reviews initially, show all when expanded
  const displayedReviews = expanded ? reviews : reviews.slice(0, 3)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">Loading reviews...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Guest Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{averageRating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Review Form */}
      <HotelReviewForm hotelId={hotelId} onReviewAdded={handleReviewAdded} />

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <HotelReviewCard key={`${review.user_id}-${review.hotel_id}`} review={review} />
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1"
              >
                {expanded ? (
                  <>
                    Show Less <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-muted-foreground">No reviews yet for this hotel.</p>
      )}
    </div>
  )
}
