import type { Room } from "@/types/room"

export const rooms: Room[] = [
  // Bali Paradise Resort (hotel_id: 1)
  {
    room_id: 1,
    hotel_id: 1,
    name: "Deluxe Ocean View",
    type: "Deluxe Room",
    location: "Main Building",
    availability: true,
    max_guests: 2,
    price_per_night: 6000000, // 6,000,000 VND
    description:
      "Spacious room with a private balcony offering stunning ocean views. Features a king-size bed and luxury bathroom with rain shower.",
    thumbnail: "/rooms/deluxe-ocean-view.png",
  },
  {
    room_id: 2,
    hotel_id: 1,
    name: "Premium Pool Access",
    type: "Premium Room",
    location: "Garden Wing",
    availability: true,
    max_guests: 3,
    price_per_night: 7500000, // 7,500,000 VND
    description:
      "Ground floor room with direct access to the swimming pool. Includes a king-size bed or twin beds and a spacious sitting area.",
    thumbnail: "/rooms/premium-pool-access.png",
  },
  {
    room_id: 3,
    hotel_id: 1,
    name: "Family Suite",
    type: "Suite",
    location: "Main Building",
    availability: true,
    max_guests: 4,
    price_per_night: 10800000, // 10,800,000 VND
    description:
      "Two-bedroom suite ideal for families. Features a master bedroom with king-size bed and a second bedroom with twin beds. Includes a living area and two bathrooms.",
    thumbnail: "/rooms/family-suite.png",
  },
  {
    room_id: 4,
    hotel_id: 1,
    name: "Beachfront Villa",
    type: "Villa",
    location: "Beachfront",
    availability: false,
    max_guests: 2,
    price_per_night: 13900000, // 13,900,000 VND
    description:
      "Exclusive villa located steps from the beach with private plunge pool. Features a king-size bed, outdoor bathroom with bathtub, and a private deck.",
    thumbnail: "/rooms/beachfront-villa.png",
  },

  // Ubud Forest Retreat (hotel_id: 2)
  {
    room_id: 5,
    hotel_id: 2,
    name: "Garden View Room",
    type: "Standard Room",
    location: "Garden Area",
    availability: true,
    max_guests: 2,
    price_per_night: 4300000, // 4,300,000 VND
    description: "Cozy room surrounded by lush tropical gardens. Features a queen-size bed and a private balcony.",
    thumbnail: "/rooms/garden-view-room.png",
  },
  {
    room_id: 6,
    hotel_id: 2,
    name: "Forest View Suite",
    type: "Suite",
    location: "Main Building",
    availability: true,
    max_guests: 2,
    price_per_night: 6700000, // 6,700,000 VND
    description:
      "Spacious suite with panoramic views of the forest. Includes a king-size bed, separate living area, and a large bathroom with bathtub.",
    thumbnail: "/rooms/forest-view-suite.png",
  },
  {
    room_id: 7,
    hotel_id: 2,
    name: "Private Pool Villa",
    type: "Villa",
    location: "Hillside",
    availability: true,
    max_guests: 2,
    price_per_night: 10800000, // 10,800,000 VND
    description:
      "Secluded villa with a private infinity pool overlooking the jungle. Features a king-size bed, outdoor shower, and a spacious deck.",
    thumbnail: "/rooms/private-pool-villa.png",
  },

  // Seminyak Boutique Hotel (hotel_id: 3)
  {
    room_id: 8,
    hotel_id: 3,
    name: "Deluxe Room",
    type: "Deluxe Room",
    location: "Main Building",
    availability: true,
    max_guests: 2,
    price_per_night: 3600000, // 3,600,000 VND
    description: "Modern room with contemporary design. Features a queen-size bed and a stylish bathroom.",
    thumbnail: "/rooms/deluxe-room.png",
  },
  {
    room_id: 9,
    hotel_id: 3,
    name: "Rooftop Suite",
    type: "Suite",
    location: "Top Floor",
    availability: true,
    max_guests: 2,
    price_per_night: 6700000, // 6,700,000 VND
    description:
      "Luxurious suite on the top floor with access to the rooftop terrace. Features a king-size bed and a spacious bathroom with bathtub.",
    thumbnail: "/rooms/rooftop-suite.png",
  },

  // Nusa Dua Beach Resort & Spa (hotel_id: 4)
  {
    room_id: 10,
    hotel_id: 4,
    name: "Garden View Room",
    type: "Standard Room",
    location: "Garden Wing",
    availability: true,
    max_guests: 2,
    price_per_night: 4800000, // 4,800,000 VND
    description: "Comfortable room overlooking the tropical gardens. Features a king-size bed or twin beds.",
    thumbnail: "/rooms/garden-view-standard.png",
  },
  {
    room_id: 11,
    hotel_id: 4,
    name: "Ocean View Room",
    type: "Deluxe Room",
    location: "Ocean Wing",
    availability: true,
    max_guests: 2,
    price_per_night: 6700000, // 6,700,000 VND
    description: "Spacious room with a private balcony offering ocean views. Features a king-size bed and a daybed.",
    thumbnail: "/rooms/ocean-view-room.png",
  },
  {
    room_id: 12,
    hotel_id: 4,
    name: "Family Room",
    type: "Family Room",
    location: "Garden Wing",
    availability: true,
    max_guests: 4,
    price_per_night: 8400000, // 8,400,000 VND
    description: "Spacious room designed for families. Features a king-size bed and two single beds or a sofa bed.",
    thumbnail: "/rooms/family-room.png",
  },
  {
    room_id: 13,
    hotel_id: 4,
    name: "Executive Suite",
    type: "Suite",
    location: "Main Building",
    availability: true,
    max_guests: 2,
    price_per_night: 10800000, // 10,800,000 VND
    description:
      "Luxurious suite with separate living area. Features a king-size bed, spacious bathroom with bathtub, and a private balcony.",
    thumbnail: "/rooms/executive-suite.png",
  },

  // Add a few rooms for other hotels
  {
    room_id: 14,
    hotel_id: 5,
    name: "Sunset View Room",
    type: "Deluxe Room",
    location: "Main Building",
    availability: true,
    max_guests: 2,
    price_per_night: 5300000, // 5,300,000 VND
    description:
      "Room with a private balcony offering spectacular sunset views of Tanah Lot Temple. Features a king-size bed.",
    thumbnail: "/rooms/sunset-view-room.png",
  },
  {
    room_id: 15,
    hotel_id: 6,
    name: "Bay View Suite",
    type: "Suite",
    location: "Beachfront",
    availability: true,
    max_guests: 2,
    price_per_night: 7700000, // 7,700,000 VND
    description:
      "Elegant suite with panoramic views of Jimbaran Bay. Features a king-size bed, separate living area, and a large bathroom with bathtub.",
    thumbnail: "/rooms/bay-view-suite.png",
  },
]
