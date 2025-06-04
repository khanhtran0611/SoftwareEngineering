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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Destination } from "@/types/destination"
import { uploadDestinationImages, deleteDestinationImage } from "@/lib/destination"
import { toast } from "@/hooks/use-toast"


type DestinationFormData = Omit<Destination, "destination_id" | "rating">

type AddEditDestinationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  destination?: Destination
  onSave: (destination: DestinationFormData | Destination) => void
  mode: "add" | "edit"
}

export default function AddEditDestinationDialog({
  open,
  onOpenChange,
  destination,
  onSave,
  mode,
}: AddEditDestinationDialogProps) {
  const [formData, setFormData] = useState<DestinationFormData>({
    name: "",
    location: "Badung",
    transportation: "Car, Motorbike",
    entry_fee: 0,
    description: "",
    latitude: 0,
    longitude: 0,
    type: "Beach",
    thumbnail: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  useEffect(() => {
    if (destination && mode === "edit") {
      const { destination_id: _, rating: __, ...rest } = destination
      setFormData(rest)
      setThumbnailPreview(null)
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        location: "Badung",
        transportation: "Car, Motorbike",
        entry_fee: 0,
        description: "",
        latitude: 0,
        longitude: 0,
        type: "Beach",
        thumbnail: "",
      })
      setThumbnailPreview(null)
    }
  }, [destination, mode, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "entry_fee" || name === "latitude" || name === "longitude") {
      // Nếu người dùng xóa hết thì giữ nguyên chuỗi rỗng trong input
      if (value === "") {
        setFormData(prev => ({ ...prev, [name]: "" }))
      } else {
        // Nếu có giá trị thì parse thành số
        const parsedValue = Number.parseFloat(value)
        setFormData(prev => ({ ...prev, [name]: parsedValue }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please upload an image file (JPEG, PNG, etc.)")
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    try {
      // Upload file qua API
      const response = await uploadDestinationImages(file)
      // Giả sử response trả về filename
      setFormData(prev => ({ ...prev, thumbnail: response.filename }))
      setThumbnailPreview(null) // Không cần preview nữa vì sẽ lấy ảnh từ server
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

      if(typeof formData.latitude !== "number" || typeof formData.longitude !== "number" || typeof formData.entry_fee !== "number"){
        toast({
          title: "Error",
          description: "Latitude and longitude must be numbers",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Xóa ảnh cũ nếu có
      if (imageToDelete) {
        await deleteDestinationImage(imageToDelete)
      }

      if (mode === "edit" && destination) {
        await onSave({
          ...formData,
          destination_id: destination.destination_id,
          rating: destination.rating
        })
      } else {
        await onSave({ ...formData, rating: 0 })
      }

      // Reset state
      setImageToDelete(null)
      onOpenChange(false)

    } catch (error) {
      console.error('Error submitting form:', error)
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
            <DialogTitle>{mode === "add" ? "Add New Destination" : "Edit Destination"}</DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Fill in the details to add a new destination. Rating will be calculated from user reviews."
                : "Update the destination information. Rating is calculated from user reviews."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Destination name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beach">Beach</SelectItem>
                    <SelectItem value="Temple">Temple</SelectItem>
                    <SelectItem value="Sightseeing">Sightseeing</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Religious">Religious</SelectItem>
                    <SelectItem value="Historical">Historical</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Romantic">Romantic</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Natural">Natural</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Binh Thuan">Binh Thuan</SelectItem>
                    <SelectItem value="Ho Chi Minh City">Ho Chi Minh City</SelectItem>
                    <SelectItem value="Cao Bang">Cao Bang</SelectItem>
                    <SelectItem value="Quang Ninh">Quang Ninh</SelectItem>
                    <SelectItem value="Quang Nam">Quang Nam</SelectItem>
                    <SelectItem value="Sa Pa, Lao Cai">Sa Pa, Lao Cai</SelectItem>
                    <SelectItem value="Hanoi">Hanoi</SelectItem>
                    <SelectItem value="Da Nang">Da Nang</SelectItem>
                    <SelectItem value="Hoi An">Hoi An</SelectItem>
                    <SelectItem value="Hoian">Hoian</SelectItem>
                    <SelectItem value="Hue">Hue</SelectItem>
                    <SelectItem value="Lam Dong">Lam Dong</SelectItem>
                    <SelectItem value="Long Xuyen">Long Xuyen</SelectItem>
                    <SelectItem value="Phu Quoc">Phu Quoc</SelectItem>
                    <SelectItem value="Phu Yen">Phu Yen</SelectItem>
                    <SelectItem value="Quang Binh">Quang Binh</SelectItem>
                    <SelectItem value="Quang Tri">Quang Tri</SelectItem>
                    <SelectItem value="Soc Trang">Soc Trang</SelectItem>
                    <SelectItem value="Tay Ninh">Tay Ninh</SelectItem>
                    <SelectItem value="Khanh Hoa">Khanh Hoa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry_fee">Entry Fee (₫)</Label>
                <Input
                  id="entry_fee"
                  name="entry_fee"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.entry_fee}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transportation">Transportation</Label>
                <Input
                  id="transportation"
                  name="transportation"
                  value={formData.transportation}
                  onChange={handleInputChange}
                  placeholder="Car, Motorbike, etc."
                  required
                />
              </div>
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
                placeholder="Describe the destination..."
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
            <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "add" ? "Add Destination" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
