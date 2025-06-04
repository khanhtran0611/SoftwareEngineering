"use client"

import { useState, useEffect } from "react"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { roomServices, servicePossessing } from "@/data/services"
import type { RoomService, ServicePossessing } from "@/types/service"
import { getServices, getServicesForRoom, AddServicetoRoom, DeletServicetoRoom } from "@/lib/services"

type ManageRoomServicesProps = {
  roomId: number
}

export default function ManageRoomServices({ roomId }: ManageRoomServicesProps) {
  const { toast } = useToast()
  const [roomServicesList, setRoomServicesList] = useState<ServicePossessing[]>([])
  const [availableServices, setAvailableServices] = useState<RoomService[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<RoomService | null>(null)

  // Load room services and available services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Fetch room services
        const roomServicePossessions = await getServicesForRoom(roomId)
        setRoomServicesList(roomServicePossessions)
        console.log(roomServicePossessions)
        // Fetch all services and filter
        const allServices = await getServices()
        const roomServiceIds = new Set(roomServicePossessions.map((s) => s.service_id))
        const availableServicesList = allServices.filter(
          (service) => !roomServiceIds.has(service.service_id)
        )
        setAvailableServices(availableServicesList)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive",
        })
      }
    }

    fetchServices()
  }, [roomId])

  const handleAddService = async (serviceId: number) => {
    try {
      const newPossession: ServicePossessing = {
        service_id: serviceId,
        room_id: roomId,
      }

      // Call API to add service
      await AddServicetoRoom(newPossession)

      // Update local state
      setRoomServicesList([...roomServicesList, newPossession])
      setAvailableServices(availableServices.filter((s) => s.service_id !== serviceId))

      // Reset form
      setIsAddDialogOpen(false)
      setSelectedService(null)

      toast({
        title: "Success",
        description: "Service has been added to this room",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      })
    }
  }

  const handleDeleteService = async (serviceId: number) => {
    try {
      // Call API to delete service
      await DeletServicetoRoom(roomId, serviceId)

      // Get the service being removed
      const serviceToRemove = roomServices.find((s) => s.service_id === serviceId)
      if (!serviceToRemove) return

      // Update local state
      setRoomServicesList(roomServicesList.filter((possession) => possession.service_id !== serviceId))

      // Thêm service đã xóa vào available services
      setAvailableServices(prev => [...prev, serviceToRemove])

      toast({
        title: "Success",
        description: "Service has been removed from this room",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove service",
        variant: "destructive",
      })
    }
  }

  const openAddDialog = (service: RoomService) => {
    setSelectedService(service)
    setIsAddDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Room Services</h2>
      </div>

      {/* Current Services */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current Services</h3>
        {roomServicesList.length === 0 ? (
          <p className="text-muted-foreground">No services added yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roomServicesList.map((possession) => {
              const service = roomServices.find((s) => s.service_id === possession.service_id)
              if (!service) return null

              return (
                <div key={possession.service_id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="font-medium">{service.name}</div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteService(possession.service_id)}>
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Available Services */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Available Services</h3>
        {availableServices.length === 0 ? (
          <p className="text-muted-foreground">All services have been added.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableServices.map((service) => (
              <Badge
                key={service.service_id}
                variant="outline"
                className="cursor-pointer py-1.5"
                onClick={() => openAddDialog(service)}
              >
                <Plus className="mr-1 h-3 w-3" />
                {service.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Add Service Dialog */}
      {selectedService && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Service: {selectedService.name}</DialogTitle>
              <DialogDescription>Add this service to the room.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleAddService(selectedService.service_id)}>Add Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
