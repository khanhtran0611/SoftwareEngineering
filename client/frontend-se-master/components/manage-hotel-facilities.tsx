"use client"

import { useState, useEffect } from "react"
import { Plus, Trash, Edit, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { facilities, facilitiesPossessing } from "@/data/facilities"
import type { Facility, FacilityPossessing } from "@/types/facility"
import { getFacilities, getFacilitiesForHotel, AddFacilitytoHotel, UpdateFacilityofHotel, DeleteFacilityofHotel } from "@/lib/facilities"

type ManageHotelFacilitiesProps = {
  hotelId: number
}

export default function ManageHotelFacilities({ hotelId }: ManageHotelFacilitiesProps) {
  const { toast } = useToast()
  const [hotelFacilities, setHotelFacilities] = useState<FacilityPossessing[]>([])
  const [availableFacilities, setAvailableFacilities] = useState<Facility[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<{
    facility: Facility
    possession?: FacilityPossessing
  } | null>(null)
  const [description, setDescription] = useState("")

  // Load hotel facilities and available facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        // Fetch hotel facilities
        const hotelFacilitiesList = await getFacilitiesForHotel(hotelId)
        setHotelFacilities(hotelFacilitiesList)

        // Fetch all facilities and filter
        const allFacilities = await getFacilities()
        const hotelFacilityIds = new Set(hotelFacilitiesList.map((f) => f.facility_id))
        const availableFacilitiesList = allFacilities.filter(
          (facility) => !hotelFacilityIds.has(facility.facility_id)
        )
        setAvailableFacilities(availableFacilitiesList)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load facilities",
          variant: "destructive",
        })
      }
    }

    fetchFacilities()
  }, [hotelId])

  const handleAddFacility = async (facilityId: number) => {
    try {
      const newPossession: FacilityPossessing = {
        facility_id: facilityId,
        hotel_id: hotelId,
        description: description.trim() || undefined,
      }

      // Call API to add facility
      await AddFacilitytoHotel(newPossession)

      // Update local state
      setHotelFacilities([...hotelFacilities, newPossession])
      setAvailableFacilities(availableFacilities.filter((f) => f.facility_id !== facilityId))

      // Reset form
      setDescription("")
      setIsAddDialogOpen(false)

      toast({
        title: "Success",
        description: "Facility has been added to your hotel",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add facility",
        variant: "destructive",
      })
    }
  }

  const handleEditFacility = async () => {
    if (!selectedFacility || !selectedFacility.possession) return

    try {
      const updatedPossession: FacilityPossessing = {
        ...selectedFacility.possession,
        description: description.trim() || undefined,
      }

      // Call API to update facility
      await UpdateFacilityofHotel(updatedPossession)

      // Update local state
      setHotelFacilities(
        hotelFacilities.map((possession) =>
          possession.facility_id === updatedPossession.facility_id ? updatedPossession : possession
        )
      )

      // Reset form
      setDescription("")
      setIsEditDialogOpen(false)
      setSelectedFacility(null)

      toast({
        title: "Success",
        description: "Facility has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update facility",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFacility = async (facilityId: number) => {
    try {
      // Call API to delete facility
      await DeleteFacilityofHotel(hotelId, facilityId)

      // Get the facility being removed from hotelFacilities
      const facilityToRemove = facilities.find((f) => f.facility_id === facilityId)

      if (!facilityToRemove) return

      // Update local state
      setHotelFacilities(hotelFacilities.filter((possession) => possession.facility_id !== facilityId))

      // Thêm facility đã xóa vào available facilities
      setAvailableFacilities(prev => [...prev, facilityToRemove])

      toast({
        title: "Success",
        description: "Facility has been removed from your hotel",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove facility",
        variant: "destructive",
      })
    }
  }

  const openAddDialog = (facility: Facility) => {
    setSelectedFacility({ facility })
    setDescription("")
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (facilityId: number) => {
    const possession = hotelFacilities.find((p) => p.facility_id === facilityId)
    const facility = facilities.find((f) => f.facility_id === facilityId)

    if (!possession || !facility) return

    setSelectedFacility({ facility, possession })
    setDescription(possession.description || "")
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Hotel Facilities</h2>
      </div>

      {/* Current Facilities */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current Facilities</h3>
        {hotelFacilities.length === 0 ? (
          <p className="text-muted-foreground">No facilities added yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hotelFacilities.map((possession) => {
              const facility = facilities.find((f) => f.facility_id === possession.facility_id)
              if (!facility) return null

              return (
                <div key={possession.facility_id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <div className="font-medium">{facility.name}</div>
                    {possession.description && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">View description</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{possession.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(possession.facility_id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteFacility(possession.facility_id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Available Facilities */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Available Facilities</h3>
        {availableFacilities.length === 0 ? (
          <p className="text-muted-foreground">All facilities have been added.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableFacilities.map((facility) => (
              <Badge
                key={facility.facility_id}
                variant="outline"
                className="cursor-pointer py-1.5"
                onClick={() => openAddDialog(facility)}
              >
                <Plus className="mr-1 h-3 w-3" />
                {facility.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Add Facility Dialog */}
      {selectedFacility && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Facility: {selectedFacility.facility.name}</DialogTitle>
              <DialogDescription>Add this facility to your hotel with an optional description.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe this facility..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleAddFacility(selectedFacility.facility.facility_id)}>Add Facility</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Facility Dialog */}
      {selectedFacility && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Facility: {selectedFacility.facility.name}</DialogTitle>
              <DialogDescription>Update the description for this facility.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe this facility..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditFacility}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
