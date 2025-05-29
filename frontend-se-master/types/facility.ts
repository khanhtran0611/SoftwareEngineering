export type Facility = {
  facility_id: number
  name: string
}

export type FacilityPossessing = {
  facility_id: number
  hotel_id: number
  description?: string
}
