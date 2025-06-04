"use client"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getHotelFacilities } from "@/lib/facilities"
import type { Facility } from "@/types/facility"

type FacilityWithDescription = {
  facility: Facility
  description: string
}

type HotelFacilitiesProps = {
  hotelId: number
}

export default function HotelFacilities({ hotelId }: HotelFacilitiesProps) {
  const [facilities, setFacilities] = useState<FacilityWithDescription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedFacility, setExpandedFacility] = useState<number | null>(null)

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true)
        const data = await getHotelFacilities(hotelId)
        console.log(data)
        setFacilities(data)
      } catch (error) {
        console.error('Error fetching facilities:', error)
        setFacilities([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFacilities()
  }, [hotelId])

  if (isLoading) {
    return <div>Loading facilities...</div>
  }

  if (facilities.length === 0) {
    return null
  }

  const toggleFacility = (facilityId: number) => {
    if (expandedFacility === facilityId) {
      setExpandedFacility(null)
    } else {
      setExpandedFacility(facilityId)
    }
  }

  // Group facilities: those with descriptions first, then those without
  const facilitiesWithDescriptions = facilities.filter((f) => f.description)
  const facilitiesWithoutDescriptions = facilities.filter((f) => !f.description)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Facilities</h2>

      {/* Facilities with descriptions - expandable list */}
      <div className="space-y-2">
        {facilitiesWithDescriptions.map(({ facility, description }) => (
          <div key={facility.facility_id} className="rounded-md border">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between px-4 py-2 text-left"
              onClick={() => toggleFacility(facility.facility_id)}
            >
              <span className="font-medium">{facility.name}</span>
              {expandedFacility === facility.facility_id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {expandedFacility === facility.facility_id && description && (
              <div className="border-t bg-muted/50 px-4 py-3 text-sm text-muted-foreground">{description}</div>
            )}
          </div>
        ))}
      </div>

      {/* Facilities without descriptions - simple badges */}
      {facilitiesWithoutDescriptions.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Other Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {facilitiesWithoutDescriptions.map(({ facility }) => (
              <Badge key={facility.facility_id} variant="outline" className="py-1.5">
                {facility.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
