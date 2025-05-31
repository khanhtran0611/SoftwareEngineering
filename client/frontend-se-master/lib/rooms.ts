import { rooms } from "@/data/rooms"
import type { Room } from "@/types/room"
import { api, fileApi } from "./api";
import { api as customerApi } from "@/lib/api"
import type { Hotel } from "@/types/hotel"

// Get all rooms
export function getAllRooms(): Room[] {
  return rooms
}

// Get a specific room by ID
export async function getRoomById(roomId: number): Promise<Room | undefined> {
  try {
    const response = await api.get(`/api/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room:', error);
    return undefined;
  }
}

// Get all rooms for a specific hotel
export async function getHotelRooms(hotelId: number): Promise<Room[]> {
  try {
    const response = await api.get(`/api/${hotelId}/rooms/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hotel rooms:', error);
    return [];
  }
}

export async function GetRoomListFromRoomId(roomId: number): Promise<Room[]> {
  try {
    const response = await api.get(`/api/rooms-lists/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room:', error);
    return [];
  }
}



// Get rooms by hotel ID (alias for getHotelRooms for backward compatibility)
export async function getRoomsByHotelId(hotelId: number): Promise<Room[]> {
  return await getHotelRooms(hotelId)
}
// Filter rooms by price range
export function filterRoomsByPrice(minPrice: number, maxPrice: number): Room[] {
  return rooms.filter((room) => room.price_per_night >= minPrice && room.price_per_night <= maxPrice)
}

// Filter rooms by capacity
export function filterRoomsByCapacity(minGuests: number): Room[] {
  return rooms.filter((room) => room.max_guests >= minGuests)
}

// Thêm hàm mới này
export async function getHotelForRoom(roomId: number): Promise<Hotel | undefined> {
  try {
    const response = await customerApi.get(`/api/rooms-hotel/${roomId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching hotel for room:', error)
    return undefined
  }
}

export async function createRoom(hotelId: number, room: Omit<Room, "room_id">): Promise<Room> {
  try {
    const response = await api.post(`/api/rooms/${hotelId}`, room)
    return response.data
  } catch (error) {
    console.error('Error creating room:', error)
    throw error
  }
}

export async function updateRoom(room: Room): Promise<Room> {
  try {
    const response = await api.put(`/api/rooms/${room.room_id}`, room)
    return response.data
  } catch (error) {
    console.error('Error updating room:', error)
    throw error
  }
}

export async function deleteRoom(roomId: number): Promise<void> {
  try {
    await api.delete(`/api/rooms/${roomId}`)
  } catch (error) {
    console.error('Error deleting room:', error)
    throw error
  }
}

export async function uploadRoomImage(image: File) {
  try {
    const formData = new FormData()
    formData.append('image', image)
    const response = await fileApi.post('/api/upload-room-image', formData)
    return response
  } catch (error) {
    console.error('Error uploading room image:', error)
    throw error
  }
}

export async function deleteRoomImage(filename: string) {
  try {
    console.log(filename)
    await api.delete(`/api/delete-room-image/${filename.substring(1)}`)
  } catch (error) {
    console.error('Error deleting room image:', error)
    throw error
  }
} 

export async function changeRoomAvailability(roomId: number, availability: boolean) {
  try {
    const response = await api.put(`/api/update-room-status/${roomId}`, { availability })
    return response.data
  } catch (error) {
    console.error('Error changing room availability:', error)
    throw error
  }
}





