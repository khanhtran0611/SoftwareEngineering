"use client"

import { useState, useEffect } from "react"
import DestinationCard from "@/components/destination-card"
import { getAllDestinations, getDestinationRecommendations, getDestinationsFromStorage, getFilteredDestinations } from "@/lib/destination"
import type { Destination } from "@/types/destination"
import { getUserFromStorage } from "@/lib/auth"

type DestinationGridProps = {
  searchQuery: string
  filters: {
    minPrice: number
    maxPrice: number
    location: string
  }
}

export default function DestinationGrid({ searchQuery, filters }: DestinationGridProps) {
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true)
        let recommendedDestinations = getDestinationsFromStorage()
        // Nếu không có filter nào được áp dụng, lấy tất cả destinations
        if (!searchQuery && !filters.location && filters.minPrice === 0 && filters.maxPrice === 10000000) {
          // let allDestinations = await getAllDestinations()
          setFilteredDestinations(recommendedDestinations)
        } else {
          // Nếu có filter, sử dụng filterDestinations
          const filteredResults = await getFilteredDestinations({
            searchQuery,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            location: filters.location
          }, recommendedDestinations)
          console.log(filteredResults)
          setFilteredDestinations(filteredResults)
        }
      } catch (error) {
        console.error('Error fetching destinations:', error)
        // Có thể thêm xử lý lỗi ở đây (ví dụ: hiển thị toast)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDestinations()
  }, [searchQuery, filters])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Đang tải điểm đến...</p>
      </div>
    )
  }
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Popular Destinations</h1>
      {filteredDestinations.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No destinations found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria to find destinations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination.destination_id} destination={destination} />
          ))}
        </div>
      )}
    </div>
  )
}
