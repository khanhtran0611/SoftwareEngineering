// Destination Review Library - Handles all destination review operations
// Completely separate from hotel review operations
import { destinationReviews } from "@/data/destination-reviews"
import { users } from "@/data/users"
import type { DestinationReview } from "@/types/destination-review"
import type { User } from "@/types/user"
import { api } from "./api"

// Get reviews for a specific destination
export async function getDestinationReviews(destinationId: number): Promise<DestinationReview[]> {
  try {
    const response = await api.get(`/customer/destinations/comment/${destinationId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching destination reviews:', error)
    throw error
  }
}

// Calculate average rating for a destination
export async function calculateDestinationAverageRating(destinationId: number): Promise<number> {
  try {
    const reviews = await getDestinationReviews(destinationId)

    if (reviews.length === 0) {
      return 2.0 + Math.random() * 1.0 // Default rating between 4.0-5.0 if no reviews
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    return Number.parseFloat((totalRating / reviews.length).toFixed(1))
  } catch (error) {
    console.error('Error calculating average rating:', error)
    throw error
  }
}

// Get user information for a review
export async function getUserForDestinationReview(userId: number): Promise<User | undefined> {
  try {
    const response = await api.get(`/customer/comment/user/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Check if user has already reviewed a destination
export async function hasUserReviewedDestination(userId: number, destinationId: number): Promise<boolean> {
  try {
    const response = await api.get(`/customer/checkuserreview/${userId}/${destinationId}`)
    if (response.data.length > 0) {
      return true
    }
    return false
  } catch (error) {
    console.error('Error checking if user reviewed destination:', error)
    throw error
  }
}

// Add a new destination review
type NewDestinationReviewData = {
  user_id: number
  destination_id: number
  rating: number
  comment: string
}

export async function addDestinationReview(reviewData: NewDestinationReviewData): Promise<DestinationReview> {
  try {
    const response = await api.post('/customer/destinations/comment', reviewData)
    return response.data
  } catch (error) {
    console.error('Error adding destination review:', error)
    throw error
  }
}

// Update an existing destination review
export async function updateDestinationReview(
  userId: number,
  destinationId: number,
  updateData: { rating?: number; comment?: string },
): Promise<DestinationReview> {
  try {
    const response = await api.put(`/customer/destinations/comment/`, {
      user_id: userId,
      destination_id: destinationId,
      rating: updateData.rating,
      comment: updateData.comment
    })
    return response.data
  } catch (error) {
    console.error('Error updating destination review:', error)
    throw error
  }
}

// Delete a destination review
export async function deleteDestinationReview(userId: number, destinationId: number): Promise<boolean> {
  try {
    await api.delete(`/customer/destinations/comment/${userId}/${destinationId}`)
    return true
  } catch (error) {
    console.error('Error deleting destination review:', error)
    throw error
    return false
  }
}
