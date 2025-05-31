import type { Hotel } from "@/types/hotel"
import { calculateAverageRating } from "@/lib/reviews"

// Define hotels without hardcoded ratings
const hotelData: Omit<Hotel, "rating">[] = [
  {
    hotel_id: 1,
    hotel_owner: 3, // This should match the hotel owner user_id from auth.ts
    name: "Bali Paradise Resort",
    address: "Jl. Pantai Kuta No. 123, Kuta, Badung",
    longitude: 115.167,
    latitude: -8.723,
    description:
      "Luxurious beachfront resort with stunning ocean views, multiple swimming pools, and world-class dining options.",
    thumbnail: "/bali-resort-pool.png",
    contact_phone: "+62 361 123456",
  },
  {
    hotel_id: 2,
    hotel_owner: 3, // Assign more hotels to the hotel owner
    name: "Ubud Forest Retreat",
    address: "Jl. Monkey Forest No. 45, Ubud, Gianyar",
    longitude: 115.259,
    latitude: -8.517,
    description:
      "Serene retreat nestled in the lush forests of Ubud, offering private villas with infinity pools and traditional Balinese spa treatments.",
    thumbnail: "/ubud-bali-jungle-villa.png",
    contact_phone: "+62 361 234567",
  },
  {
    hotel_id: 3,
    hotel_owner: 3, // Assign to hotel owner
    name: "Seminyak Boutique Hotel",
    address: "Jl. Kayu Aya No. 88, Seminyak, Badung",
    longitude: 115.156,
    latitude: -8.694,
    description:
      "Stylish boutique hotel in the heart of Seminyak, close to trendy restaurants, beach clubs, and designer boutiques.",
    thumbnail: "/placeholder-juq5h.png",
    contact_phone: "+62 361 345678",
  },
  {
    hotel_id: 4,
    hotel_owner: 6, // References user_id from users data
    name: "Nusa Dua Beach Resort & Spa",
    address: "Kawasan BTDC Lot N-3, Nusa Dua, Badung",
    longitude: 115.231,
    latitude: -8.795,
    description:
      "Elegant beachfront resort in the exclusive Nusa Dua area, featuring spacious rooms, private beach access, and comprehensive spa facilities.",
    thumbnail: "/nusa-dua-resort-bali.png",
    contact_phone: "+62 361 456789",
  },
  {
    hotel_id: 5,
    hotel_owner: 5, // References user_id from users data
    name: "Tanah Lot Sunset Hotel",
    address: "Jl. Raya Tanah Lot, Beraban, Tabanan",
    longitude: 115.087,
    latitude: -8.622,
    description:
      "Perfectly positioned hotel offering spectacular views of the iconic Tanah Lot Temple and breathtaking sunsets over the Indian Ocean.",
    thumbnail: "/tanah-lot-sunset-hotel-bali.png",
    contact_phone: "+62 361 567890",
  },
  {
    hotel_id: 6,
    hotel_owner: 4, // References user_id from users data
    name: "Jimbaran Bay Suites",
    address: "Jl. Pantai Jimbaran No. 55, Jimbaran, Badung",
    longitude: 115.166,
    latitude: -8.791,
    description: "Upscale suites overlooking Jimbaran Bay, famous for its seafood restaurants and golden sand beaches.",
    thumbnail: "/jimbaran-bay-sunset.png",
    contact_phone: "+62 361 678901",
  },
  {
    hotel_id: 7,
    hotel_owner: 6, // References user_id from users data
    name: "Tegallalang Valley Resort",
    address: "Jl. Raya Tegallalang, Tegallalang, Gianyar",
    longitude: 115.278,
    latitude: -8.432,
    description:
      "Eco-friendly resort with stunning views of the famous Tegallalang Rice Terraces, offering traditional Balinese architecture and farm-to-table dining.",
    thumbnail: "/placeholder.svg?height=300&width=500&query=rice+terrace+view+hotel+bali",
    contact_phone: "+62 361 789012",
  },
  {
    hotel_id: 8,
    hotel_owner: 5, // References user_id from users data
    name: "Uluwatu Cliff Hotel",
    address: "Jl. Uluwatu, Pecatu, Badung",
    longitude: 115.084,
    latitude: -8.828,
    description:
      "Dramatic cliff-top hotel near Uluwatu Temple, featuring infinity pools that seem to merge with the ocean and luxurious rooms with panoramic views.",
    thumbnail: "/placeholder.svg?height=300&width=500&query=uluwatu+cliff+hotel+infinity+pool",
    contact_phone: "+62 361 890123",
  },
  {
    hotel_id: 9,
    hotel_owner: 4, // References user_id from users data
    name: "Kuta Beach Inn",
    address: "Jl. Pantai Kuta No. 45, Kuta, Badung",
    longitude: 115.166,
    latitude: -8.719,
    description:
      "Affordable and comfortable accommodation in the heart of Kuta, just steps away from the beach, shopping, and nightlife.",
    thumbnail: "/placeholder.svg?height=300&width=500&query=kuta+beach+hotel+bali",
    contact_phone: "+62 361 901234",
  },
  {
    hotel_id: 10,
    hotel_owner: 6, // References user_id from users data
    name: "Sanur Beachfront Resort",
    address: "Jl. Danau Tamblingan No. 122, Sanur, Denpasar",
    longitude: 115.263,
    latitude: -8.678,
    description:
      "Tranquil beachfront resort in the laid-back area of Sanur, offering traditional Balinese hospitality, lush gardens, and direct beach access.",
    thumbnail: "/placeholder.svg?height=300&width=500&query=sanur+beach+resort+bali",
    contact_phone: "+62 361 012345",
  },
]

// Generate hotels with calculated ratings
export const hotels: Hotel[] = hotelData.map((hotel) => ({
  ...hotel,
  rating: calculateAverageRating(hotel.hotel_id),
}))

// Helper function to get hotels by owner
export function getHotelsByOwner(ownerId: number): Hotel[] {
  return hotels.filter((hotel) => hotel.hotel_owner === ownerId)
}

// Helper function to check if a user owns a specific hotel
export function isHotelOwner(userId: number, hotelId: number): boolean {
  const hotel = hotels.find((h) => h.hotel_id === hotelId)
  return hotel ? hotel.hotel_owner === userId : false
}
