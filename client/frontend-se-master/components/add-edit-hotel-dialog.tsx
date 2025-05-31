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
import { Textarea } from "@/components/ui/textarea"
import { getUserFromStorage } from "@/lib/auth"
import type { Hotel } from "@/types/hotel"
import { AddHotel, UpdateHotel, uploadHotelImage, deleteHotelImage } from "@/lib/hotel"
import { useToast } from "@/components/ui/use-toast"

type AddEditHotelDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotel?: Hotel
  onSave: (hotel: Omit<Hotel, "hotel_id" | "rating"> | Hotel) => void
  mode: "add" | "edit"
}

export default function AddEditHotelDialog({ open, onOpenChange, hotel, onSave, mode }: AddEditHotelDialogProps) {
  const [formData, setFormData] = useState<Omit<Hotel, "hotel_id" | "rating">>({
    hotel_owner: 0,
    name: "",
    address: "",
    longitude: 0,
    latitude: 0,
    description: "",
    thumbnail: "",
    contact_phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [thumbnailRemoved, setThumbnailRemoved] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (hotel && mode === "edit") {
      const { hotel_id: _, rating: __, ...rest } = hotel
      setFormData(rest)
      setThumbnailPreview(null)
      setThumbnailRemoved(false)
    } else {
      // Reset form for add mode and set current user as hotel owner
      const user = getUserFromStorage()
      setFormData({
        hotel_owner: user?.user_id || 0,
        name: "",
        address: "",
        longitude: 0,
        latitude: 0,
        description: "",
        thumbnail: "",
        contact_phone: "",
      })
      setThumbnailPreview(null)
      setThumbnailRemoved(false)
    }
  }, [hotel, mode, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "longitude" || name === "latitude" || name === "hotel_owner" ? Number.parseFloat(value) || 0 : value,
    }))
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
      const response = await uploadHotelImage(file)
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

  const handleRemoveThumbnail = () => {
    setThumbnailPreview(null)
    setFormData((prev) => ({ ...prev, thumbnail: "" }))
    setThumbnailRemoved(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Nếu có ảnh cần xóa thì xóa trước
      if (imageToDelete) {
        await deleteHotelImage(imageToDelete)
      }

      if (mode === "edit" && hotel) {
        const updatedHotel = await UpdateHotel({
          ...formData,
          hotel_id: hotel.hotel_id,
          rating: hotel.rating
        })
        onSave(updatedHotel)
      } else {
        const user = getUserFromStorage()
        const newHotel = await AddHotel(formData, user?.user_id || 0)
        onSave(newHotel)
      }

      // Reset các state
      setImageToDelete(null)
      onOpenChange(false)

      // Hiển thị thông báo thành công
      toast({
        title: "Success",
        description: mode === "edit" ? "Hotel updated successfully" : "Hotel added successfully",
      })

      // Reset form sau khi thành công
      const user = getUserFromStorage()
      setFormData({
        hotel_owner: user?.user_id || 0,
        name: "",
        address: "",
        longitude: 0,
        latitude: 0,
        description: "",
        thumbnail: "",
        contact_phone: "",
      })
      setThumbnailPreview(null)
      setThumbnailRemoved(false)

    } catch (error) {
      // Hiển thị thông báo lỗi
      toast({
        title: "Error",
        description: mode === "edit" ? "Failed to update hotel" : "Failed to add hotel",
        variant: "destructive"
      })
      console.error("Error saving hotel:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDialogClose = async (open: boolean) => {
    if (!open) {
      setImageToDelete(null) // Reset state khi đóng dialog
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Add New Hotel" : "Edit Hotel"}</DialogTitle>
            <DialogDescription>
              {mode === "add" ? "Fill in the details to add a new hotel." : "Update the hotel information."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hotel Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Hotel name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  placeholder="+62 123 456 789"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Full address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the hotel..."
                rows={4}
                required
              />
            </div>

            {/* Thumbnail Upload Section */}
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
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
                        alt="Thumbnail preview"
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
                      Remove Thumbnail
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "add" ? "Add Hotel" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
