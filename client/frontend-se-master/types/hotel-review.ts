export type HotelReview = {
  user_id: number
  hotel_id: number
  rating: number
  comment: string
  date_created: string
}

// Form props for hotel reviews
export type HotelReviewFormProps = {
  hotelId: number
  onReviewAdded: () => void
}

// Review section props for hotels
export type HotelReviewSectionProps = {
  hotelId: number
}
