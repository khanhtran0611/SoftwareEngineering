import { api, fileApi } from '@/lib/api'
import type { Hotel } from '@/types/hotel'

export const getAllHotels = async (): Promise<Hotel[]> => {
    try {
        const response = await api.get('/api/hotels')
        return response.data
    } catch (error) {
        console.error('Error fetching hotels:', error)
        throw error
    }
}

export async function getHotelById(hotelId: number): Promise<Hotel> {
    try {
        const response = await api.get(`/api/hotels/${hotelId}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching hotel with ID ${hotelId}:`, error)
        throw error
    }
}

export async function getHotelByUserId(userId: number): Promise<Hotel[]> {    
    try {
        const response = await api.get(`/api/hotels/owner/${userId}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching hotel with user ID ${userId}:`, error)
        throw error
    }
}


export async function AddHotel(hotel: Omit<Hotel, "hotel_id" | "rating">, userId: number): Promise<Hotel> {
    try {
        hotel.hotel_owner = userId
        const response = await api.post('/api/add-hotel', hotel)
        return response.data
    } catch (error) {
        console.error('Error adding hotel:', error) 
        throw error
    }
}

export async function UpdateHotel(hotel: Hotel): Promise<Hotel> {
    try {
        const response = await api.put(`/api/edit-hotel/${hotel.hotel_id}`, hotel)
        return response.data
    } catch (error) {
        console.error('Error updating hotel:', error)
        throw error
    }
}

export async function DeleteHotel(hotelId: number): Promise<void> {
    try {
        await api.delete(`/api/hotels/${hotelId}`)
    } catch (error) {
        console.error('Error deleting hotel:', error)
        throw error
    }
}

export async function uploadHotelImage(image: File) {
    try {
        const formData = new FormData()
        formData.append('image', image)
        const response = await fileApi.post(`/api/upload-hotel-image`, formData)
        return response
    } catch (error) {
        console.error('Error uploading hotel image:', error)
        throw error
    }
}

export async function deleteHotelImage(filename: string): Promise<void> {
    try {
        await api.delete(`/api/delete-hotel-image/${filename.substring(1)}`)
    } catch (error) {
        console.error('Error deleting hotel image:', error)
        throw error
    }
}





