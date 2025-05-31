import { roomServices, servicePossessing } from "@/data/services"
import type { RoomService, ServicePossessing } from "@/types/service"
import { api } from "./api"


export async function getServices(): Promise<RoomService[]> {
  try {
    const response = await api.get(`/api/hotels/allservices`)
    return response.data
  } catch (error) {
    console.error("Error fetching services:", error)
    throw error
  }
}

// Get all services for a specific room
export async function getRoomServices(roomId: number): Promise<RoomService[]> {
  try {
    const response = await api.get(`/api/hotels/room-services/${roomId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching services for room ${roomId}:`, error)
    throw error
  }
}

export async function getServicesForRoom(roomId: number): Promise<ServicePossessing[]> {
  try {
    const response = await api.get(`/api/hotels/services/${roomId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching services:", error)
    throw error
  }
}

export async function AddServicetoRoom(newPossession: ServicePossessing) {
  try {
    const response = await api.post(`/api/hotels/service-add`, newPossession)
    return response.data
  } catch (error) {
    console.error("Error fetching services:", error)
    throw error
  }
}

export async function DeletServicetoRoom(roomId: number, serviceId: number) {
  try {
    const response = await api.delete(`/api/hotels/service-delete/${roomId}/${serviceId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching services:", error)
    throw error
  }
}
