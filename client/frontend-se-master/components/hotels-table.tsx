"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash, Plus, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import AddEditHotelDialog from "@/components/add-edit-hotel-dialog"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import { hotels as initialHotels, getHotelsByOwner } from "@/data/hotels"
import { DeleteHotel } from "@/lib/hotel"
import { getUserFromStorage } from "@/lib/auth"
import { users } from "@/data/users"
import type { Hotel } from "@/types/hotel"
import { getAllHotels, getHotelByUserId } from "@/lib/hotel"

type HotelsTableProps = {
  searchQuery: string
}

export default function HotelsTable({ searchQuery }: HotelsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true)
      try {
        const user = getUserFromStorage()

        if (user && user.role === "hotel owner") {
          // Nếu là hotel owner, dùng getHotelByUserId
          const data = await getHotelByUserId(user.user_id)
          setHotels(data)
          setFilteredHotels(data)
        } else {
          // Nếu là admin, lấy tất cả hotels
          const data = await getAllHotels()
          setHotels(data)
          setFilteredHotels(data)
        }

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load hotels",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = hotels.filter((hotel) => hotel.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredHotels(filtered)
    } else {
      setFilteredHotels(hotels)
    }
  }, [searchQuery, hotels])

  const getOwnerName = (ownerId: number): string => {
    const owner = getUserFromStorage()
    return owner ? owner.name : "Unknown Owner"
  }

  const handleAddHotel = (newHotel: Omit<Hotel, "hotel_id" | "rating">) => {
    // Generate a new ID (in a real app, this would be handled by the backend)
    const newId = Math.max(...hotels.map((h) => h.hotel_id), 0) + 1

    const hotelToAdd: Hotel = {
      ...newHotel,
      hotel_id: newId,
      rating: 0, // New hotels start with 0 rating
    }

    setHotels([...hotels, hotelToAdd])
    setIsAddDialogOpen(false)

    toast({
      title: "Hotel added",
      description: `${newHotel.name} has been added successfully.`,
    })
  }

  const handleEditHotel = (hotel: Hotel | Omit<Hotel, "hotel_id" | "rating">) => {
    // Type guard to ensure we have a complete Hotel object for editing
    if (!("hotel_id" in hotel)) {
      console.error("Cannot edit hotel: missing hotel_id")
      return
    }

    const updatedHotel = hotel as Hotel
    const updatedHotels = hotels.map((h) => (h.hotel_id === updatedHotel.hotel_id ? updatedHotel : h))

    setHotels(updatedHotels)
    setIsEditDialogOpen(false)
    setSelectedHotel(null)

    toast({
      title: "Hotel updated",
      description: `${updatedHotel.name} has been updated successfully.`,
    })
  }

  const handleDeleteHotel = async () => {
    if (!selectedHotel) return

    setIsDeleting(true)
    try {
      await DeleteHotel(selectedHotel.hotel_id)
      // Sau khi xóa thành công, cập nhật state
      const updatedHotels = hotels.filter((hotel) => hotel.hotel_id !== selectedHotel.hotel_id)
      setHotels(updatedHotels)
      setIsDeleteDialogOpen(false)
      setSelectedHotel(null)

      // Hiển thị thông báo thành công
      toast({
        title: "Hotel deleted",
        description: `${selectedHotel.name} has been deleted successfully.`,
      })

    } catch (error) {
      // Xử lý lỗi
      toast({
        title: "Error",
        description: "Failed to delete hotel",
        variant: "destructive",
      })
      console.error("Error deleting hotel:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const openEditDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setIsDeleteDialogOpen(true)
  }

  const viewHotelDetails = (hotel: Hotel) => {
    router.push(`/hotel/dashboard/hotel/${hotel.hotel_id}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Hotels</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHotels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No hotels found.
                </TableCell>
              </TableRow>
            ) : (
              filteredHotels.map((hotel) => (
                <TableRow key={hotel.hotel_id}>
                  <TableCell className="font-medium">{hotel.hotel_id}</TableCell>
                  <TableCell>{hotel.name}</TableCell>
                  <TableCell>{getOwnerName(hotel.hotel_owner)}</TableCell>
                  <TableCell>{hotel.address}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{hotel.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{hotel.contact_phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => viewHotelDetails(hotel)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(hotel)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openDeleteDialog(hotel)} title="Delete">
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

      {/* Add Hotel Dialog */}
      <AddEditHotelDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddHotel} mode="add" />

      {/* Edit Hotel Dialog */}
      {selectedHotel && (
        <AddEditHotelDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          hotel={selectedHotel}
          onSave={handleEditHotel}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedHotel && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteHotel}
          destinationName={selectedHotel.name}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
