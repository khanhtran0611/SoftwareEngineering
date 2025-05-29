"use client"

import { useState, useEffect } from "react"
import { Edit, Trash, Plus, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import AddEditDestinationDialog from "@/components/add-edit-destination-dialog"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import { getAllDestinations, createDestination, updateDestination, deleteDestination } from "@/lib/destination"
import type { Destination } from "@/types/destination"

// Add this type definition to match what the dialog expects
type DestinationFormData = Omit<Destination, "destination_id" | "rating">

import DestinationImagesDialog from "@/components/destination-images-dialog"
import { formatVND } from "@/lib/currency"

type DestinationsTableProps = {
  searchQuery: string
}

export default function DestinationsTable({ searchQuery }: DestinationsTableProps) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [isImagesDialogOpen, setIsImagesDialogOpen] = useState(false)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true)
      try {
        const data = await getAllDestinations()
        setDestinations(data)
        setFilteredDestinations(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load destinations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = destinations.filter((destination) =>
        destination.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredDestinations(filtered)
    } else {
      setFilteredDestinations(destinations)
    }
  }, [searchQuery, destinations])

  const handleAddDestination = async (newDestination: DestinationFormData) => {
    try {
      const createdDestination = await createDestination(newDestination)
      setDestinations([...destinations, createdDestination])
      setIsAddDialogOpen(false)
      toast({
        title: "Destination added",
        description: `${newDestination.name} has been added successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add destination",
        variant: "destructive",
      })
    }
  }

  const handleEditDestination = async (destination: Destination | DestinationFormData) => {
    if ("destination_id" in destination) {
      try {
        const updatedDestination = await updateDestination(
          destination
        )

        const updatedDestinations = destinations.map((dest) =>
          dest.destination_id === destination.destination_id ? updatedDestination : dest
        )
        setDestinations(updatedDestinations)
        setIsEditDialogOpen(false)
        setSelectedDestination(null)

        toast({
          title: "Destination updated",
          description: `${destination.name} has been updated successfully.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update destination",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteDestination = async () => {
    if (!selectedDestination) return

    try {
      await deleteDestination(selectedDestination.destination_id)

      const updatedDestinations = destinations.filter(
        (destination) => destination.destination_id !== selectedDestination.destination_id
      )

      setDestinations(updatedDestinations)
      setIsDeleteDialogOpen(false)
      setSelectedDestination(null)

      toast({
        title: "Destination deleted",
        description: `${selectedDestination.name} has been deleted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete destination",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (destination: Destination) => {
    setSelectedDestination(destination)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (destination: Destination) => {
    setSelectedDestination(destination)
    setIsDeleteDialogOpen(true)
  }

  const openImagesDialog = (destination: Destination) => {
    setSelectedDestination(destination)
    setIsImagesDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Destinations</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Destination
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Use the "Manage Images" button to add, edit, or delete images for each destination and select a thumbnail.
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry Fee</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading destinations...
                </TableCell>
              </TableRow>
            ) : filteredDestinations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No destinations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDestinations.map((destination) => (
                <TableRow key={destination.destination_id}>
                  <TableCell className="font-medium">{destination.destination_id}</TableCell>
                  <TableCell>{destination.name}</TableCell>
                  <TableCell>{destination.location}</TableCell>
                  <TableCell>{destination.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span>{destination.entry_fee === 0 ? "Free" : formatVND(destination.entry_fee)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openImagesDialog(destination)}
                      className="flex items-center gap-1"
                    >
                      Manage Images
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(destination)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(destination)}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Destination Dialog */}
      <AddEditDestinationDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddDestination}
        mode="add"
      />

      {/* Edit Destination Dialog */}
      {selectedDestination && (
        <AddEditDestinationDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          destination={selectedDestination}
          onSave={handleEditDestination}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedDestination && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteDestination}
          destinationName={selectedDestination.name}
        />
      )}

      {/* Images Dialog */}
      {selectedDestination && (
        <DestinationImagesDialog
          open={isImagesDialogOpen}
          onOpenChange={setIsImagesDialogOpen}
          destination={selectedDestination}
          onUpdateDestination={handleEditDestination}
        />
      )}
    </div>
  )
}
