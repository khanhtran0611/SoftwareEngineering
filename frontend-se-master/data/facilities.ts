import type { Facility, FacilityPossessing } from "@/types/facility"

export const facilities: Facility[] = [
  {
    facility_id: 1,
    name: "Free Wi-Fi",
  },
  {
    facility_id: 2,
    name: "Swimming Pool",
  },
  {
    facility_id: 3,
    name: "Parking Lot",
  },
  {
    facility_id: 4,
    name: "Airport Shuttle Service",
  },
  {
    facility_id: 5,
    name: "Gym",
  },
  {
    facility_id: 6,
    name: "Spa & Massage",
  },
  {
    facility_id: 7,
    name: "Restaurant",
  },
  {
    facility_id: 8,
    name: "Bar",
  },
  {
    facility_id: 9,
    name: "24/7 Reception",
  },
  {
    facility_id: 10,
    name: "Laundry Service",
  },
]

export const facilitiesPossessing: FacilityPossessing[] = [
  // Tropical Beach Resort (hotel_id: 1)
  {
    facility_id: 1,
    hotel_id: 1,
    description: "High-speed wireless internet throughout the resort",
  },
  {
    facility_id: 2,
    hotel_id: 1,
    description: "Large outdoor swimming pool with ocean view",
  },
  {
    facility_id: 3,
    hotel_id: 1,
    description: "Complimentary parking for all guests",
  },
  {
    facility_id: 4,
    hotel_id: 1,
    description: "Free shuttle service to and from Ngurah Rai Airport",
  },
  {
    facility_id: 6,
    hotel_id: 1,
    description: "Full-service spa with traditional Balinese treatments",
  },
  {
    facility_id: 7,
    hotel_id: 1,
    description: "Three restaurants offering international and local cuisine",
  },
  {
    facility_id: 8,
    hotel_id: 1,
    description: "Beachfront bar with sunset views",
  },
  {
    facility_id: 9,
    hotel_id: 1,
    description: "24-hour front desk service",
  },

  // Ubud Forest Retreat (hotel_id: 2)
  {
    facility_id: 1,
    hotel_id: 2,
    description: "Complimentary Wi-Fi in all areas",
  },
  {
    facility_id: 2,
    hotel_id: 2,
    description: "Infinity pool overlooking the jungle",
  },
  {
    facility_id: 3,
    hotel_id: 2,
    description: "Free parking available",
  },
  {
    facility_id: 6,
    hotel_id: 2,
    description: "Award-winning spa with traditional healing treatments",
  },
  {
    facility_id: 7,
    hotel_id: 2,
    description: "Farm-to-table restaurant using locally sourced ingredients",
  },
  {
    facility_id: 9,
    hotel_id: 2,
    description: "24-hour reception and concierge service",
  },

  // Seminyak Boutique Hotel (hotel_id: 3)
  {
    facility_id: 1,
    hotel_id: 3,
    description: "Free high-speed internet access",
  },
  {
    facility_id: 2,
    hotel_id: 3,
    description: "Rooftop swimming pool",
  },
  {
    facility_id: 3,
    hotel_id: 3,
    description: "Valet parking service",
  },
  {
    facility_id: 5,
    hotel_id: 3,
    description: "Modern fitness center with latest equipment",
  },
  {
    facility_id: 7,
    hotel_id: 3,
    description: "Contemporary restaurant with fusion cuisine",
  },
  {
    facility_id: 8,
    hotel_id: 3,
    description: "Rooftop bar with sunset views",
  },
  {
    facility_id: 9,
    hotel_id: 3,
    description: "24-hour front desk assistance",
  },

  // Nusa Dua Beach Resort & Spa (hotel_id: 4)
  {
    facility_id: 1,
    hotel_id: 4,
    description: "Complimentary Wi-Fi throughout the resort",
  },
  {
    facility_id: 2,
    hotel_id: 4,
    description: "Multiple swimming pools including children's pool",
  },
  {
    facility_id: 3,
    hotel_id: 4,
    description: "Free self-parking and valet parking",
  },
  {
    facility_id: 4,
    hotel_id: 4,
    description: "Complimentary airport shuttle service",
  },
  {
    facility_id: 5,
    hotel_id: 4,
    description: "Fully equipped fitness center",
  },
  {
    facility_id: 6,
    hotel_id: 4,
    description: "Luxury spa with comprehensive treatment menu",
  },
  {
    facility_id: 7,
    hotel_id: 4,
    description: "Multiple dining options including beachfront restaurant",
  },
  {
    facility_id: 8,
    hotel_id: 4,
    description: "Pool bar and lobby bar",
  },
  {
    facility_id: 9,
    hotel_id: 4,
    description: "24-hour reception and room service",
  },
  {
    facility_id: 10,
    hotel_id: 4,
    description: "Professional laundry and dry cleaning service",
  },

  // Tanah Lot Sunset Hotel (hotel_id: 5)
  {
    facility_id: 1,
    hotel_id: 5,
    description: "Free Wi-Fi in all rooms and public areas",
  },
  {
    facility_id: 2,
    hotel_id: 5,
    description: "Outdoor pool with temple views",
  },
  {
    facility_id: 3,
    hotel_id: 5,
    description: "Complimentary parking",
  },
  {
    facility_id: 7,
    hotel_id: 5,
    description: "Restaurant with panoramic views of Tanah Lot Temple",
  },
  {
    facility_id: 9,
    hotel_id: 5,
    description: "24-hour front desk service",
  },

  // Jimbaran Bay Suites (hotel_id: 6)
  {
    facility_id: 1,
    hotel_id: 6,
    description: "Complimentary wireless internet",
  },
  {
    facility_id: 2,
    hotel_id: 6,
    description: "Beachfront swimming pool",
  },
  {
    facility_id: 3,
    hotel_id: 6,
    description: "Free parking for guests",
  },
  {
    facility_id: 7,
    hotel_id: 6,
    description: "Seafood restaurant on the beach",
  },
  {
    facility_id: 9,
    hotel_id: 6,
    description: "24-hour reception",
  },

  // Add basic facilities for remaining hotels (7-10)
  {
    facility_id: 1,
    hotel_id: 7,
    description: "Free Wi-Fi access",
  },
  {
    facility_id: 2,
    hotel_id: 7,
    description: "Swimming pool",
  },
  {
    facility_id: 7,
    hotel_id: 7,
    description: "On-site restaurant",
  },

  {
    facility_id: 1,
    hotel_id: 8,
    description: "Complimentary Wi-Fi",
  },
  {
    facility_id: 2,
    hotel_id: 8,
    description: "Infinity pool with ocean views",
  },
  {
    facility_id: 8,
    hotel_id: 8,
    description: "Poolside bar",
  },

  {
    facility_id: 1,
    hotel_id: 9,
    description: "Free wireless internet",
  },
  {
    facility_id: 7,
    hotel_id: 9,
    description: "Traditional restaurant",
  },

  {
    facility_id: 1,
    hotel_id: 10,
    description: "Wi-Fi throughout the property",
  },
  {
    facility_id: 2,
    hotel_id: 10,
    description: "Beachfront pool",
  },
  {
    facility_id: 7,
    hotel_id: 10,
    description: "Beachside restaurant",
  },
]
