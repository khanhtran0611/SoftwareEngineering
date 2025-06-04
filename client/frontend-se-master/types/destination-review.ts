// Destination Review Types - Separate from hotel reviews
export type DestinationReview = {
  user_id: number
  destination_id: number
  rating: number
  comment: string
  date_created: string
}

// Form props for destination reviews
export type DestinationReviewFormProps = {
  destinationId: number
  onReviewAdded: () => void
}

// Review section props for destinations
export type DestinationReviewSectionProps = {
  destinationId: number
}
