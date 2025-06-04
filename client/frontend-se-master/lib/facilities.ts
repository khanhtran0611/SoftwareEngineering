import { facilities, facilitiesPossessing } from "@/data/facilities"
import type { Facility, FacilityPossessing } from "@/types/facility"
import { api } from "./api"

// Get all facilities for a specific hotel
type FacilityWithDescription = {
  facility: Facility
  description: string
}


export async function getFacilities(): Promise<Facility[]> {
  try {
    const response = await api.get(`/api/hotels/allfacilities`)
    return response.data
  } catch (error) {
    console.error("Error fetching facilities:", error)
    throw error
  }
}


// Get all facilities for a specific hotel
export async function getHotelFacilities(hotelId: number): Promise<FacilityWithDescription[]> {
  try {
    const response = await api.get(`/api/hotels/hotel-facilities/${hotelId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching facilities for hotel ${hotelId}:`, error)
    throw error
  }
}

export async function getFacilitiesForHotel(hotelId: number): Promise<FacilityPossessing[]>  {
  try {
    const response = await api.get(`/api/hotels/facilities/${hotelId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching facilities:", error)
    throw error
  }
}

export async function AddFacilitytoHotel(newPossession: FacilityPossessing) {
  try {
    const response = await api.post(`/api/hotels/facility-add`, newPossession)
    return response.data
  } catch (error) {
    console.error("Error fetching facilities:", error)
    throw error
  }
}

export async function UpdateFacilityofHotel(updatedPossession: FacilityPossessing) {
  try {
    const response = await api.put(`/api/hotels/facility-edit`, {updatedPossession})
    return response.data
  } catch (error) {
    console.error("Error fetching facilities:", error)
    throw error
  }
}

export async function DeleteFacilityofHotel(hotelId: number, facilityId: number) {
  try {
    const response = await api.delete(`/api/hotels/facility-delete/${hotelId}/${facilityId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching facilities:", error)
    throw error
  }
}