// Haversine formula to calculate distance between two points on Earth
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
export function findNearbyHotels(
  latitude: number,
  longitude: number,
  hotels: any[],
  maxDistance = 30, // Default max distance in kilometers
) {
  return hotels.filter((hotel) => {
    const distance = calculateDistance(latitude, longitude, hotel.latitude, hotel.longitude)
    return distance <= maxDistance
  })
}
