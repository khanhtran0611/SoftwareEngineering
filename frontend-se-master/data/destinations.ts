import type { Destination } from "@/types/destination"
import { calculateDestinationAverageRating } from "@/lib/destination-reviews"

// Define destinations without hardcoded ratings
const destinationData: Omit<Destination, "rating">[] = [
  {
    destination_id: 1,
    name: "Tanah Lot",
    location: "Tabanan",
    transportation: "Car, Motorbike",
    entry_fee: 1440000, // ~$60 USD converted to VND
    description:
      "Tanah Lot is a rock formation off the Indonesian island of Bali. Tanah Lot is one of the most iconic landmarks of Bali, known for its unique offshore setting and sunset backdrops.",
    latitude: -8.621213,
    longitude: 115.086654,
    type: "Temple",
    thumbnail: "/tanah-lot-temple-bali.png",
  },
  {
    destination_id: 2,
    name: "Garuda Wisnu Kencana",
    location: "Badung",
    transportation: "Car, Motorbike, Bus",
    entry_fee: 3000000, // ~$125 USD converted to VND
    description:
      "Garuda Wisnu Kencana, or GWK, is a cultural park on Bali's southern coast. It's known for its massive statue and cultural performances showcasing the rich iconic cultural heritage.",
    latitude: -8.810333,
    longitude: 115.16743,
    type: "Cultural Park",
    thumbnail: "/placeholder-xbp79.png",
  },
  {
    destination_id: 3,
    name: "Kuta Beach",
    location: "Badung",
    transportation: "Car, Motorbike, Bus",
    entry_fee: 0, // Free entry
    description:
      "Kuta Beach is a popular tourist destination in Bali, known for its long sandy beach with wide sand stretching 3 kilometers. It's famous for surfing and stunning sunsets.",
    latitude: -8.719094,
    longitude: 115.166451,
    type: "Beach",
    thumbnail: "/kuta-beach-bali-sunset.png",
  },
  {
    destination_id: 4,
    name: "Ubud Monkey Forest",
    location: "Gianyar",
    transportation: "Car, Motorbike",
    entry_fee: 1920000, // ~$80 USD converted to VND
    description:
      "The Sacred Monkey Forest Sanctuary is a nature reserve and temple complex in Ubud. It's a natural habitat for the Balinese long-tailed monkey and is loved by some groups of monkeys.",
    latitude: -8.518744,
    longitude: 115.258796,
    type: "Nature Reserve",
    thumbnail: "/placeholder-h7aab.png",
  },
  {
    destination_id: 5,
    name: "Uluwatu Temple",
    location: "Badung",
    transportation: "Car, Motorbike",
    entry_fee: 1200000, // ~$50 USD converted to VND
    description:
      "Uluwatu Temple is a Balinese Hindu sea temple located on a cliff top with a breathtaking view of the Indian Ocean. It's known for its magnificent location and Kecak fire dance performances.",
    latitude: -8.828506,
    longitude: 115.084417,
    type: "Temple",
    thumbnail: "/placeholder.svg?height=400&width=600&query=Uluwatu+Temple+Cliff+Bali",
  },
  {
    destination_id: 6,
    name: "Tegallalang Rice Terraces",
    location: "Gianyar",
    transportation: "Car, Motorbike",
    entry_fee: 360000, // ~$15 USD converted to VND
    description:
      "The Tegallalang Rice Terraces offer a picturesque view of rice paddies on terraced hillsides. The terraced rice fields showcase the traditional Balinese cooperative irrigation system called subak.",
    latitude: -8.431884,
    longitude: 115.277641,
    type: "Natural Landscape",
    thumbnail: "/placeholder.svg?height=400&width=600&query=Tegallalang+Rice+Terraces+Bali",
  },
  {
    destination_id: 7,
    name: "Seminyak Beach",
    location: "Badung",
    transportation: "Car, Motorbike",
    entry_fee: 0, // Free entry
    description:
      "Seminyak Beach is a beautiful stretch of white sand beach north of Kuta and Legian. It's known for its upscale resorts, fine dining restaurants, and high-end boutiques.",
    latitude: -8.694245,
    longitude: 115.156791,
    type: "Beach",
    thumbnail: "/placeholder.svg?height=400&width=600&query=Seminyak+Beach+Bali",
  },
  {
    destination_id: 8,
    name: "Bali Safari and Marine Park",
    location: "Gianyar",
    transportation: "Car, Tour Bus",
    entry_fee: 6960000, // ~$290 USD converted to VND
    description:
      "Bali Safari and Marine Park is a world-class wildlife conservation facility that houses over 100 species. Visitors can observe animals in their natural habitats through safari journeys.",
    latitude: -8.620716,
    longitude: 115.327576,
    type: "Wildlife Park",
    thumbnail: "/placeholder.svg?height=400&width=600&query=Bali+Safari+and+Marine+Park",
  },
]

// Generate destinations with calculated ratings
export const destinations: Destination[] = destinationData.map((destination) => ({
  ...destination,
  rating: calculateDestinationAverageRating(destination.destination_id),
}))
