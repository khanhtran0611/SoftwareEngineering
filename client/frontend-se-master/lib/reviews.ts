// Hotel Review Library - Handles all hotel review operations
// Completely separate from destination review operations

import { reviews } from "@/data/reviews"
import { users } from "@/data/users"
import type { HotelReview } from "@/types/hotel-review"
import type { User } from "@/types/user"
import { api } from "./api"

// Get reviews for a specific hotel
export function getHotelReviews(hotelId: number): HotelReview[] {
  return reviews.filter((review) => review.hotel_id === hotelId)
}

// Calculate average rating for a hotel
export function calculateAverageRating(hotelId: number): number | null {
  const hotelReviews = getHotelReviews(hotelId)

  if (hotelReviews.length === 0) {
    return null // Return null instead of 0 when no reviews
  }

  const totalRating = hotelReviews.reduce((sum, review) => sum + review.rating, 0)
  return Number.parseFloat((totalRating / hotelReviews.length).toFixed(1))
}

// Get user information for a review
export function getUserForReview(userId: number): User | undefined {
  return users.find((user) => user.user_id === userId)
}



// Check if a user has already reviewed a hotel
export function hasUserReviewedHotel(userId: number, hotelId: number): boolean {
  return reviews.some((review) => review.user_id === userId && review.hotel_id === hotelId)
}

// Add a new review
type NewReviewData = {
  user_id: number
  hotel_id: number
  rating: number
  comment: string
}

export function addReview(reviewData: NewReviewData): HotelReview {
  // Check if user has already reviewed this hotel
  if (hasUserReviewedHotel(reviewData.user_id, reviewData.hotel_id)) {
    throw new Error("User has already reviewed this hotel")
  }

  // Create a new review
  const newReview: HotelReview = {
    user_id: reviewData.user_id,
    hotel_id: reviewData.hotel_id,
    rating: reviewData.rating,
    comment: reviewData.comment,
    date_created: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
  }

  // Add to the reviews array (in a real app, this would be a database call)
  reviews.push(newReview)

  return newReview
}

// Update an existing review
export function updateReview(
  userId: number,
  hotelId: number,
  updateData: Partial<Pick<HotelReview, "rating" | "comment">>,
): HotelReview | null {
  const reviewIndex = reviews.findIndex((review) => review.user_id === userId && review.hotel_id === hotelId)

  if (reviewIndex === -1) {
    return null
  }

  // Update the review
  reviews[reviewIndex] = {
    ...reviews[reviewIndex],
    ...updateData,
    date_created: new Date().toISOString().split("T")[0], // Update the date
  }

  return reviews[reviewIndex]
}

// Delete a review
export function deleteReview(userId: number, hotelId: number): boolean {
  const reviewIndex = reviews.findIndex((review) => review.user_id === userId && review.hotel_id === hotelId)

  if (reviewIndex === -1) {
    return false
  }

  reviews.splice(reviewIndex, 1)
  return true
}

// Get a specific review by user and hotel
export function getReview(userId: number, hotelId: number): HotelReview | undefined {
  return reviews.find((review) => review.user_id === userId && review.hotel_id === hotelId)
}
