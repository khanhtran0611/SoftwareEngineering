import { Review } from "@/types/review"
import { User } from "@/types/user"
import { api } from "./api"
import { HotelReview } from "@/types/hotel-review"
export async function getMyReviews(hotelId: number) {
    try {

        const response = await api.get(`/customer/comments/${hotelId}`)
        return response.data
    
      } catch (error) {
        console.error(`Error fetching reviews for hotel ${hotelId}:`, error)
        throw error
      }
}


export async function calculateAverageRating(hotelId: number): Promise<number> {
    try {
  
      const hotelReviews = await getMyReviews(hotelId)
  
      if (hotelReviews.length === 0) {
        return 0
      }
  
      const totalRating = hotelReviews.reduce((sum: number, review: HotelReview) => sum + review.rating, 0)
      return Number.parseFloat((totalRating / hotelReviews.length).toFixed(1))
    } catch (error) {
      console.error(`Error calculating average rating for hotel ${hotelId}:`, error)
      throw error
    }
  }
  
  // Get user information for a review
  export async function getUserForReview(userId: number): Promise<User | undefined> {
    try {
      const response = await api.get(`/customer/profile/${userId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error)
      throw error
    }
  }

  export async function hasUserReviewedHotel(userId: number, hotelId: number): Promise<boolean> {
    console.log(2)
    const response = await api.get(`/customer/checkhotelreview/${userId}/${hotelId}`)
    if(response.data.length > 0){
        return true
    }
    return false
  }


  type NewReviewData = {
    user_id: number
    hotel_id: number
    rating: number
    comment: string
  }
  
  export async function addReview(reviewData: NewReviewData): Promise<Review> {
    try {
    console.log(reviewData)
      const response = await api.post('/customer/commenting', {
        user_id: reviewData.user_id,
        hotel_id: reviewData.hotel_id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      return response.data
    } catch (error) {
      console.error('Error adding review:', error)
      throw error
    }
  }