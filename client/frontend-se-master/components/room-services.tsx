"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { getRoomServices } from "@/lib/services"
import type { RoomService } from "@/types/service"

type RoomServicesProps = {
  roomId: number
}

export default function RoomServices({ roomId }: RoomServicesProps) {
  const [services, setServices] = useState<RoomService[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        const data = await getRoomServices(roomId)
        setServices(data)
      } catch (error) {
        console.error('Error fetching room services:', error)
        setServices([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [roomId])

  if (isLoading) {
    return <div>Loading services...</div>
  }

  if (services.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Included Services</h3>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Badge key={service.service_id} variant="outline" className="py-1.5">
            {service.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
