import { lovingListData } from "@/data/loving-list"
import type { LovingList } from "@/types/loving-list"
import { User } from "@/types/user"
import { api } from "./api"
import { Destination } from "@/types/destination"

// Get all favorite destinations for a user
// export const getUserFavoriteDestinations = (userId: number): number[] => {
//   return lovingListData.filter((item) => item.user_id === userId).map((item) => item.destination_id)
// }

export async function getUserFavoriteDestinations(userId: number): Promise<number[]> {
  try {
    // Gọi API với user_id để lấy danh sách favorites
    const response = await api.get(`/customer/loving/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user favorites:', error)
    throw error
  }
}

// Check if user has favorited a destination
export async function isDestinationFavorited(userId: number, destinationId: number): Promise<boolean> {
  try {
    const response = await api.get(`/customer/checkloving/${userId}/${destinationId}`)
    if(response.data.length > 0){
      return true
    }
    return false  
  } catch (error) {
    console.error('Error checking if destination is favorited:', error)
    throw error
  }
}

// Add destination to favorites
// export const addDestinationToFavorites = (userId: number, destinationId: number): void => {
//   // Check if already exists
//   if (!isDestinationFavorited(userId, destinationId)) {
//     lovingListData.push({ user_id: userId, destination_id: destinationId })
//   }
// }

export async function addDestinationToFavorites(userId: number, destinationId: number): Promise<void> {
  try {
    await api.post(`/customer/addloving`, {
      user_id : userId,
      destination_id :destinationId
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    throw error
  }
}

// Remove destination from favorites
// export const removeDestinationFromFavorites = (userId: number, destinationId: number): void => {
//   const index = lovingListData.findIndex((item) => item.user_id === userId && item.destination_id === destinationId)
//   if (index > -1) {
//     lovingListData.splice(index, 1)
//   }
// }

export async function removeDestinationFromFavorites(userId: number, destinationId: number): Promise<void> {
  try {
    await api.delete(`/customer/deleteloving/${userId}/${destinationId}`)
  } catch (error) {
    console.error('Error removing from favorites:', error)
    throw error
  }
}

// Get all loving list entries (for admin purposes)
export const getAllLovingList = (): LovingList[] => {
  return lovingListData
}
