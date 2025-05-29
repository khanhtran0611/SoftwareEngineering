"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Edit, Trash, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import AddEditRoomDialog from "@/components/add-edit-room-dialog"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import { getHotelRooms, createRoom, updateRoom, deleteRoom } from "@/lib/rooms"
import { formatVND } from "@/lib/currency"
import type { Room } from "@/types/room"

type RoomsTableProps = {
  hotelId: number
  searchQuery: string
}

export default function RoomsTable({ hotelId, searchQuery }: RoomsTableProps) {
  const { toast } = useToast()
  const [rooms, setRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true)
      try {
        const data = await getHotelRooms(hotelId)
        setRooms(data)
        setFilteredRooms(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load rooms",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [hotelId])

  useEffect(() => {
    if (searchQuery) {
      const filtered = rooms.filter(
        (room) =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredRooms(filtered)
    } else {
      setFilteredRooms(rooms)
    }
  }, [searchQuery, rooms])

  const handleAddRoom = async (newRoom: Omit<Room, "room_id">) => {
    try {
      const roomToAdd = {
        ...newRoom,
        hotel_id: hotelId,
      }

      const createdRoom = await createRoom(hotelId, roomToAdd)
      setRooms([...rooms, createdRoom])
      setIsAddDialogOpen(false)

      toast({
        title: "Room added",
        description: `${newRoom.name} has been added successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add room",
        variant: "destructive",
      })
    }
  }

  const handleEditRoom = async (updatedRoom: Room | Omit<Room, "room_id">) => {
    if (!("room_id" in updatedRoom)) {
      console.error("Cannot edit room without room_id")
      return
    }

    try {
      const updated = await updateRoom(updatedRoom)
      const updatedRooms = rooms.map((room) =>
        room.room_id === updated.room_id ? updated : room
      )

      setRooms(updatedRooms)
      setIsEditDialogOpen(false)
      setSelectedRoom(null)

      toast({
        title: "Room updated",
        description: `${updatedRoom.name} has been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update room",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRoom = () => {
    if (!selectedRoom) return

    const updatedRooms = rooms.filter((room) => room.room_id !== selectedRoom.room_id)

    setRooms(updatedRooms)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Room deleted",
      description: `${selectedRoom.name} has been deleted successfully.`,
    })

    setSelectedRoom(null)
  }

  const openEditDialog = (room: Room) => {
    setSelectedRoom(room)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (room: Room) => {
    setSelectedRoom(room)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Rooms</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading rooms...
                </TableCell>
              </TableRow>
            ) : filteredRooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No rooms found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRooms.map((room) => (
                <TableRow key={room.room_id}>
                  <TableCell>
                    <div className="relative h-12 w-16 overflow-hidden rounded-md">
                      <Image
                        src={room.thumbnail || "/placeholder.svg?height=300&width=500&query=hotel+room"}
                        alt={room.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.location}</TableCell>
                  <TableCell>{formatVND(room.price_per_night)}/night</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Max {room.max_guests}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={room.availability ? "default" : "destructive"}>
                      {room.availability ? "Available" : "Booked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(room)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openDeleteDialog(room)} title="Delete">
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

      {/* Add Room Dialog */}
      <AddEditRoomDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddRoom}
        mode="add"
        hotelId={hotelId}
      />

      {/* Edit Room Dialog */}
      {selectedRoom && (
        <AddEditRoomDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          room={selectedRoom}
          onSave={handleEditRoom}
          mode="edit"
          hotelId={hotelId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedRoom && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteRoom}
          destinationName={selectedRoom.name}
        />
      )}
    </div>
  )
}
