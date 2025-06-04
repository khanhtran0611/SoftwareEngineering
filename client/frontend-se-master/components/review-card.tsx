"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getUserForReview } from "@/lib/review2"
import type { Review } from "@/types/review"
import type { User } from "@/types/user"

type ReviewCardProps = {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserForReview(review.user_id)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [review.user_id])

  // Format the date
  const formattedDate = format(parseISO(review.date_created), "MMM d, yyyy")

  if (isLoading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={user?.profile_image || "/placeholder.svg?height=40&width=40&query=user"}
              alt={user?.name || "User"}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{user?.name || "Anonymous"}</h4>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>

            <div className="mt-1 flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
