"use client"

import type React from "react"
import type { HotelReviewFormProps } from "@/types/hotel-review"

// Hotel Review Form - Handles reviews for hotels only
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getUserFromStorage } from "@/lib/auth"
import { addReview, hasUserReviewedHotel } from "@/lib/review2"

export default function ReviewForm({ hotelId, onReviewAdded }: HotelReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false)

  useEffect(() => {
    const checkExistingReview = async () => {
      const user = getUserFromStorage()
      if (user) {
        try {
          const alreadyReviewed = await hasUserReviewedHotel(user.user_id, hotelId)
          setHasAlreadyReviewed(alreadyReviewed)
        } catch (error) {
          console.error('Error checking review status:', error)
        }
      }
    }

    checkExistingReview()
  }, [hotelId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment before submitting your review.",
        variant: "destructive",
      })
      return
    }

    // Get current user
    const user = getUserFromStorage()
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    try {
      const hasReviewed = await hasUserReviewedHotel(user.user_id, hotelId)
      if (hasReviewed) {
        toast({
          title: "Review already exists",
          description: "You have already reviewed this hotel.",
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)

      // Submit review
      await addReview({
        user_id: user.user_id,
        hotel_id: hotelId,
        rating,
        comment,
      })

      // Clear form
      setRating(0)
      setComment("")

      // Show success message
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!",
      })

      // Notify parent component that a review was added
      onReviewAdded()
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "There was an error submitting your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Hotel Review</CardTitle>
        {hasAlreadyReviewed && (
          <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">You have already reviewed this hotel</p>
          </div>
        )}
      </CardHeader>
      {!hasAlreadyReviewed && (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating > 0 ? `You rated ${rating} star${rating > 1 ? "s" : ""}` : "Select a rating"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="block text-sm font-medium">
                Your Review
              </label>
              <Textarea
                id="comment"
                placeholder="Share your experience staying at this hotel..."
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
