"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReviewCard from "@/components/review-card"
import { getHotelReviews } from "@/lib/reviews"
import type { HotelReview } from "@/types/hotel-review"
import { getMyReviews } from "@/lib/review2"

type ReviewSectionProps = {
  hotelId: number
  averageRating: number
  refreshTrigger?: number
}

export default function ReviewSection({ hotelId, averageRating, refreshTrigger = 0 }: ReviewSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [reviews, setReviews] = useState<HotelReview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Refresh reviews when the refreshTrigger changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        const data = await getMyReviews(hotelId)
        setReviews(data)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [hotelId, refreshTrigger])

  // Show only 3 reviews initially, show all when expanded
  const displayedReviews = expanded ? reviews : reviews.slice(0, 3)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded mb-4" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Guest Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{averageRating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <ReviewCard key={`${review.user_id}-${review.hotel_id}`} review={review} />
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
