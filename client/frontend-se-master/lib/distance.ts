// Haversine formula to calculate distance between two points on Earth
import { api } from '@/lib/api';
import { getUserFromStorage } from "@/lib/auth"
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return distance
}

// Find nearby hotels within a certain distance
export async function findNearbyHotels(
  latitude: number,
  longitude: number,
  hotels: any[],
  maxDistance = 30, // Default max distance in kilometers
) {
  // Tạo mảng nearbyHotels và thêm hotel nếu thỏa mãn điều kiện
  const nearbyHotels = []
  for (const hotel of hotels) {
    const distance = calculateDistance(latitude, longitude, hotel.latitude, hotel.longitude)
    if (distance <= maxDistance) {
      nearbyHotels.push(hotel)
    }
  }

  

  const user = getUserFromStorage()
  try {
    // Gửi danh sách khách sạn gần nhất lên API
    console.log('User ID:', user?.user_id)
    console.log('Nearby hotelssss:', nearbyHotels)
    const response = await api.post('/api/hotels/rec_hotel', { user_id: user?.user_id, hotels: nearbyHotels })
    console.log('Response:', response)
    return response.data
  } catch (error) {
    console.error('Error sending nearby hotels:', error)
    throw error
  }
}
