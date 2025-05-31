import type { LovingList } from "@/types/loving-list"

// Mock data for LovingList table
export const lovingListData: LovingList[] = [
  // John Doe (user_id: 1) loves these destinations
  { user_id: 1, destination_id: 1 }, // Tanah Lot
  { user_id: 1, destination_id: 3 }, // Kuta Beach
  { user_id: 1, destination_id: 5 }, // Uluwatu Temple

  // Other users' favorites
  { user_id: 2, destination_id: 2 }, // Admin loves GWK
  { user_id: 2, destination_id: 4 }, // Admin loves Monkey Forest
  { user_id: 3, destination_id: 6 }, // Hotel Manager loves Rice Terraces
  { user_id: 3, destination_id: 7 }, // Hotel Manager loves Seminyak Beach
]
