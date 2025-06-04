import type { RoomService, ServicePossessing } from "@/types/service"

export const roomServices: RoomService[] = [
  {
    service_id: 1,
    name: "Daily Housekeeping",
  },
  {
    service_id: 2,
    name: "In-Room Breakfast Service",
  },
  {
    service_id: 3,
    name: "Air Conditioning",
  },
  {
    service_id: 4,
    name: "Towel and Bed Linen Change",
  },
  {
    service_id: 5,
    name: "Wake-Up Call",
  },
  {
    service_id: 6,
    name: "Laundry and Ironing",
  },
  {
    service_id: 7,
    name: "Hot Tub",
  },
  {
    service_id: 8,
    name: "Free Drinking Water",
  },
  {
    service_id: 9,
    name: "Cable TV",
  },
  {
    service_id: 10,
    name: "Technical Support (TV/Wi-Fi)",
  },
]

export const servicePossessing: ServicePossessing[] = [
  // Deluxe Ocean View (room_id: 1)
  {
    service_id: 1,
    room_id: 1,
  },
  {
    service_id: 2,
    room_id: 1,
  },
  {
    service_id: 3,
    room_id: 1,
  },
  {
    service_id: 4,
    room_id: 1,
  },
  {
    service_id: 8,
    room_id: 1,
  },
  {
    service_id: 9,
    room_id: 1,
  },

  // Premium Pool Access (room_id: 2)
  {
    service_id: 1,
    room_id: 2,
  },
  {
    service_id: 2,
    room_id: 2,
  },
  {
    service_id: 3,
    room_id: 2,
  },
  {
    service_id: 4,
    room_id: 2,
  },
  {
    service_id: 5,
    room_id: 2,
  },
  {
    service_id: 6,
    room_id: 2,
  },
  {
    service_id: 8,
    room_id: 2,
  },
  {
    service_id: 9,
    room_id: 2,
  },
  {
    service_id: 10,
    room_id: 2,
  },

  // Family Suite (room_id: 3)
  {
    service_id: 1,
    room_id: 3,
  },
  {
    service_id: 2,
    room_id: 3,
  },
  {
    service_id: 3,
    room_id: 3,
  },
  {
    service_id: 4,
    room_id: 3,
  },
  {
    service_id: 8,
    room_id: 3,
  },
  {
    service_id: 9,
    room_id: 3,
  },

  // Beachfront Villa (room_id: 4)
  {
    service_id: 1,
    room_id: 4,
  },
  {
    service_id: 2,
    room_id: 4,
  },
  {
    service_id: 3,
    room_id: 4,
  },
  {
    service_id: 4,
    room_id: 4,
  },
  {
    service_id: 5,
    room_id: 4,
  },
  {
    service_id: 6,
    room_id: 4,
  },
  {
    service_id: 7,
    room_id: 4,
  },
  {
    service_id: 8,
    room_id: 4,
  },
  {
    service_id: 9,
    room_id: 4,
  },
  {
    service_id: 10,
    room_id: 4,
  },

  // Garden View Room (room_id: 5)
  {
    service_id: 1,
    room_id: 5,
  },
  {
    service_id: 2,
    room_id: 5,
  },
  {
    service_id: 3,
    room_id: 5,
  },
  {
    service_id: 8,
    room_id: 5,
  },

  // Forest View Suite (room_id: 6)
  {
    service_id: 1,
    room_id: 6,
  },
  {
    service_id: 2,
    room_id: 6,
  },
  {
    service_id: 3,
    room_id: 6,
  },
  {
    service_id: 4,
    room_id: 6,
  },
  {
    service_id: 5,
    room_id: 6,
  },
  {
    service_id: 8,
    room_id: 6,
  },
  {
    service_id: 9,
    room_id: 6,
  },

  // Private Pool Villa (room_id: 7)
  {
    service_id: 1,
    room_id: 7,
  },
  {
    service_id: 2,
    room_id: 7,
  },
  {
    service_id: 3,
    room_id: 7,
  },
  {
    service_id: 4,
    room_id: 7,
  },
  {
    service_id: 6,
    room_id: 7,
  },
  {
    service_id: 7,
    room_id: 7,
  },
  {
    service_id: 8,
    room_id: 7,
  },
  {
    service_id: 9,
    room_id: 7,
  },

  // Add basic services for remaining rooms (8-15)
  {
    service_id: 1,
    room_id: 8,
  },
  {
    service_id: 3,
    room_id: 8,
  },
  {
    service_id: 8,
    room_id: 8,
  },
  {
    service_id: 9,
    room_id: 8,
  },

  {
    service_id: 1,
    room_id: 9,
  },
  {
    service_id: 2,
    room_id: 9,
  },
  {
    service_id: 3,
    room_id: 9,
  },
  {
    service_id: 8,
    room_id: 9,
  },
  {
    service_id: 9,
    room_id: 9,
  },

  {
    service_id: 1,
    room_id: 10,
  },
  {
    service_id: 3,
    room_id: 10,
  },
  {
    service_id: 8,
    room_id: 10,
  },

  {
    service_id: 1,
    room_id: 11,
  },
  {
    service_id: 3,
    room_id: 11,
  },
  {
    service_id: 8,
    room_id: 11,
  },
  {
    service_id: 9,
    room_id: 11,
  },

  {
    service_id: 1,
    room_id: 12,
  },
  {
    service_id: 2,
    room_id: 12,
  },
  {
    service_id: 3,
    room_id: 12,
  },
  {
    service_id: 8,
    room_id: 12,
  },
  {
    service_id: 9,
    room_id: 12,
  },

  {
    service_id: 1,
    room_id: 13,
  },
  {
    service_id: 2,
    room_id: 13,
  },
  {
    service_id: 3,
    room_id: 13,
  },
  {
    service_id: 4,
    room_id: 13,
  },
  {
    service_id: 6,
    room_id: 13,
  },
  {
    service_id: 8,
    room_id: 13,
  },
  {
    service_id: 9,
    room_id: 13,
  },

  {
    service_id: 1,
    room_id: 14,
  },
  {
    service_id: 3,
    room_id: 14,
  },
  {
    service_id: 8,
    room_id: 14,
  },

  {
    service_id: 1,
    room_id: 15,
  },
  {
    service_id: 2,
    room_id: 15,
  },
  {
    service_id: 3,
    room_id: 15,
  },
  {
    service_id: 8,
    room_id: 15,
  },
  {
    service_id: 9,
    room_id: 15,
  },
]
