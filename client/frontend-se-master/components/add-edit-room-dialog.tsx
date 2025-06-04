"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ManageRoomServices from "@/components/manage-room-services"
import type { Room } from "@/types/room"
import { createRoom, updateRoom, deleteRoom, uploadRoomImage, deleteRoomImage } from "@/lib/rooms"
import { useToast } from "@/components/ui/use-toast"
import { checkBookingStatus } from "@/lib/bookings"

type AddEditRoomDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  room?: Room
  onSave: (room: Omit<Room, "room_id"> | Room) => void
  mode: "add" | "edit"
  hotelId: number
  onDelete?: (roomId: number) => void
}

export default function AddEditRoomDialog({ open, onOpenChange, room, onSave, mode, hotelId, onDelete }: AddEditRoomDialogProps) {
  const [formData, setFormData] = useState<Omit<Room, "room_id">>({
    hotel_id: hotelId,
    name: "",
    type: "",
    location: "Main Building",
    availability: true,
    max_guests: 2,
    price_per_night: 100,
    description: "",
    thumbnail: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const { toast } = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (room && mode === "edit") {
      const { room_id: _, ...rest } = room
      setFormData(rest)
      setThumbnailPreview(null)
    } else {
      // Reset form for add mode
      setFormData({
        hotel_id: hotelId,
        name: "",
        type: "",
        location: "Main Building",
        availability: true,
        max_guests: 2,
        price_per_night: 0,
        description: "",
        thumbnail: "",
      })
      setThumbnailPreview(null)
    }
    // Reset to details tab when dialog opens/closes
    setActiveTab("details")
  }, [room, mode, open, hotelId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
   
    if (name === "price_per_night" || name === "max_guests") {
      // Nếu người dùng xóa hết thì giữ nguyên chuỗi rỗng trong input
      if (value === "" || isNaN(Number(value))) {
        
        setFormData(prev => ({ ...prev, [name]: "" }))
      } else {
        // Nếu có giá trị thì parse thành số
        const parsedValue = Number.parseInt(value, 10)
        setFormData(prev => ({ ...prev, [name]: parsedValue }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, availability: checked }))
  }

  // Drag and drop handlers for thumbnail
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleThumbnailFileUpload(files[0])
    }
  }

  const handleThumbnailFileUpload = async (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please upload an image file (JPEG, PNG, etc.)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    try {
      const response = await uploadRoomImage(file)
      console.log(response.filename)
      setFormData(prev => ({ ...prev, thumbnail: response.filename }))
      setThumbnailPreview(null)
    } catch (error) {
      alert("Failed to upload image")
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleThumbnailFileUpload(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Xóa ảnh cũ nếu có
      if (imageToDelete) {
        await deleteRoomImage(imageToDelete)
      }

      if (mode === "edit" && room) {
        const updatedRoom = await updateRoom({
          ...formData,
          room_id: room.room_id
        })
        onSave(updatedRoom)
      } else {
        const newRoom = await createRoom(hotelId, formData)
        onSave(newRoom)
      }

      // Reset state
      setImageToDelete(null)
      onOpenChange(false)

      toast({
        title: "Success",
        description: mode === "edit" ? "Room updated successfully" : "Room added successfully",
      })

      // Reset form
      setFormData({
        hotel_id: hotelId,
        name: "",
        type: "",
        location: "Main Building",
        availability: true,
        max_guests: 2,
        price_per_night: 0,
        description: "",
        thumbnail: "",
      })
      setThumbnailPreview(null)

    } catch (error) {
      toast({
        title: "Error",
        description: mode === "edit" ? "Failed to update room" : "Failed to add room",
        variant: "destructive"
      })
      console.error("Error saving room:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!room) return

    try {
      setIsSubmitting(true)
      const response = await checkBookingStatus(room.room_id)
      if(response){
        toast({
          title: "Error",
          description: "Room is booked",
          variant: "destructive"
        })
        return
      }
      // Gọi API xóa room
      await deleteRoom(room.room_id)

      // Đóng dialog
      onOpenChange(false)

      // Callback để update UI ở component cha
      onDelete?.(room.room_id)

      toast({
        title: "Success",
        description: "Room deleted successfully",
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive"
      })
      console.error("Error deleting room:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    await handleDelete()
    setShowDeleteConfirm(false)
  }

  const handleDialogClose = async (open: boolean) => {
    if (!open && formData.thumbnail && !room?.thumbnail) {
      // Nếu đang đóng dialog và có ảnh mới upload nhưng chưa save
      try {
        await deleteRoomImage(formData.thumbnail)
      } catch (error) {
        console.error("Failed to delete temporary image:", error)
      }
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Room" : "Edit Room"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Fill in the details to add a new room." : "Update the room information."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Room Details</TabsTrigger>
            <TabsTrigger value="services" disabled={mode === "add"}>
              Room Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <form id="room-form" onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Room Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Room name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Room Type</Label>
                    <Input
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      placeholder="e.g. Standard Room, Deluxe Room, Suite"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Main Building, Garden Wing"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_guests">Maximum Guests</Label>
                    <Input
                      id="max_guests"
                      name="max_guests"
                      type="number"
                      min="1"
                      value={formData.max_guests}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_per_night">Price per Night (VND)</Label>
                    <Input
                      id="price_per_night"
                      name="price_per_night"
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.price_per_night}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability" className="block mb-2">
                      Availability
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="availability" checked={formData.availability} onCheckedChange={handleSwitchChange} />
                      <Label htmlFor="availability" className="cursor-pointer">
                        {formData.availability ? "Available" : "Not Available"}
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the room..."
                    rows={4}
                    required
                  />
                </div>

                {/* Thumbnail Upload Section */}
                <div className="space-y-2">
                  <Label>Room Image</Label>
                  <div
                    className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
                      }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {thumbnailPreview || (formData.thumbnail && formData.thumbnail !== "") ? (
                      <div className="space-y-4">
                        <div className="relative h-40 mx-auto w-full max-w-xs">
                          <Image
                            src={thumbnailPreview || formData.thumbnail}
                            alt="Room image preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setThumbnailPreview(null)
                            setImageToDelete(formData.thumbnail)
                            setFormData((prev) => ({ ...prev, thumbnail: "" }))
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Drag and drop an image here, or click to select a file
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="thumbnail-upload"
                          onChange={handleFileInputChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={() => document.getElementById("thumbnail-upload")?.click()}
                        >
                          Select File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="services">
            {mode === "edit" && room && (
              <div className="py-4">
                <ManageRoomServices roomId={room.room_id} />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
            Cancel
          </Button>
          <Button type="submit" form="room-form" disabled={isSubmitting || activeTab !== "details"}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "add" ? "Add Room" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Room</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this room? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
