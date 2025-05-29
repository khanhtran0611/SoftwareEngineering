"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import DestinationReviewCard from "@/components/destination-review-card"
import DestinationReviewForm from "@/components/destination-review-form"
import { getDestinationReviews, calculateDestinationAverageRating } from "@/lib/destination-reviews"
import type { DestinationReview } from "@/types/destination-review"

type DestinationReviewSectionProps = {
  destinationId: number
}

export default function DestinationReviewSection({ destinationId }: DestinationReviewSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [reviews, setReviews] = useState<DestinationReview[]>([])
  const [averageRating, setAverageRating] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch reviews and rating
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Fetch reviews và rating cùng lúc
        const [reviewsData, ratingData] = await Promise.all([
          getDestinationReviews(destinationId),
          calculateDestinationAverageRating(destinationId)
        ])

        setReviews(reviewsData)
        setAverageRating(ratingData)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        // Có thể thêm xử lý lỗi ở đây (ví dụ: hiển thị toast)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [destinationId, refreshTrigger])

  // Refresh reviews when a new review is added
  const handleReviewAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  // Show only 3 reviews initially, show all when expanded
  const displayedReviews = expanded ? reviews : reviews.slice(0, 3)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded" />
          <div className="h-6 w-24 bg-gray-200 rounded" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Visitor Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Review Form */}
      <DestinationReviewForm destinationId={destinationId} onReviewAdded={handleReviewAdded} />

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <DestinationReviewCard
                key={`${review.user_id}-${review.destination_id}-${review.date_created}`}
                review={review}
              />
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
        <p className="text-center text-muted-foreground">No reviews yet for this destination.</p>
      )}
    </div>
  )
}
