"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import HotelCard from "@/components/hotel-card"
import type { Hotel } from "@/types/hotel"

type HotelCarouselProps = {
  hotels: Hotel[]
  title?: string
}

export default function HotelCarousel({ hotels, title = "Nearby Hotels" }: HotelCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  if (hotels.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={scrollLeft} className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {hotels.map((hotel) => (
          <div key={hotel.hotel_id} className="min-w-[280px] max-w-[280px] flex-shrink-0 snap-start">
            <HotelCard hotel={hotel} />
          </div>
        ))}
      </div>
    </div>
  )
}
