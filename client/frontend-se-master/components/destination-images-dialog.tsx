"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Loader2, Plus, Trash, Pencil, Upload } from "lucide-react"
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
import { useToast } from "@/components/ui/use-toast"
import { destinationImages as initialDestinationImages } from "@/data/images"
import type { DestinationImage } from "@/types/image"
import type { Destination } from "@/types/destination"
import {
  uploadDestinationImages,
  deleteDestinationImageonDB,
  createDestinationImageRecord,
  updateDestinationImage
} from "@/lib/destination"
import { getDestinationImages } from "@/lib/images"

type DestinationImagesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  destination: Destination
  onUpdateDestination: (updatedDestination: Destination) => void
}

export default function DestinationImagesDialog({
  open,
  onOpenChange,
  destination,
  onUpdateDestination,
}: DestinationImagesDialogProps) {
  const [images, setImages] = useState<DestinationImage[]>([])
  const [editImageId, setEditImageId] = useState<number | null>(null)
  const [editImageUrl, setEditImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const { toast } = useToast()

  // Load images for this destination
  useEffect(() => {
    if (open && destination) {
      const loadImages = async () => {
        try {
          const images = await getDestinationImages(destination.destination_id)
          setImages(images)
          console.log(images)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load destination images"
          })
        }
      }
      loadImages()
    }
  }, [open, destination])

  const handleAddUploadedImage = async () => {
    console.log(uploadPreview)
    if (!uploadPreview) return
    console.log(uploadPreview)
    try {
      const newImage = await createDestinationImageRecord({
        destination_id: destination.destination_id,
        image_url: uploadPreview
      })

      setImages([...images, newImage.data])
      setUploadPreview(null)

      toast({
        title: "Success",
        description: "Image added successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add image"
      })
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteDestinationImageonDB(imageId) // Dùng API xóa mới

      const updatedImages = images.filter(img => img.image_id !== imageId)
      setImages(updatedImages)

      if (destination.thumbnail === images.find(img => img.image_id === imageId)?.image_url) {
        const updatedDestination = {
          ...destination,
          thumbnail: updatedImages.length > 0 ? updatedImages[0].image_url : "/road-to-destination.png"
        }
        onUpdateDestination(updatedDestination)
      }

      toast({
        title: "Success",
        description: "Image deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image"
      })
    }
  }

  const handleEditImage = (imageId: number) => {
    const image = images.find((img) => img.image_id === imageId)
    if (image) {
      setEditImageId(imageId)
      setEditImageUrl(image.image_url)
    }
  }

  const handleSaveEdit = async () => {
    if (!editImageUrl.trim() || !editImageId) return

    try {
      await updateDestinationImage(editImageId, {
        image_url: editImageUrl
      })

      const updatedImages = images.map(img =>
        img.image_id === editImageId ? { ...img, image_url: editImageUrl } : img
      )
      setImages(updatedImages)

      if (destination.thumbnail === images.find(img => img.image_id === editImageId)?.image_url) {
        const updatedDestination = {
          ...destination,
          thumbnail: editImageUrl
        }
        onUpdateDestination(updatedDestination)
      }

      setEditImageId(null)
      setEditImageUrl("")

      toast({
        title: "Success",
        description: "Image updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update image"
      })
    }
  }

  const cancelEdit = () => {
    setEditImageId(null)
    setEditImageUrl("")
  }

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    if (!file.type.match("image.*")) {
      toast({
        title: "Error",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await uploadDestinationImages(file)
      console.log("Response filename:", response.filename)
      setUploadPreview(response.filename)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      })
    }
  }
  console.log(uploadPreview)
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Manage Images for {destination.name}</DialogTitle>
          <DialogDescription>
            Add, edit, or delete images for this destination. You can set a thumbnail in the Edit Destination dialog.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Upload Image Section */}
          <div className="space-y-2">
            <Label>Upload Image</Label>
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
                }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadPreview ? (
                <div className="space-y-4">
                  <div className="relative h-40 mx-auto w-full max-w-xs">
                    <Image
                      src={uploadPreview || "/placeholder.svg"}
                      alt="Upload preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => setUploadPreview(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUploadedImage} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Add Image
                    </Button>
                  </div>
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
                    id="file-upload"
                    onChange={handleFileInputChange}
                  />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Select File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Image list */}
          <div className="space-y-2">
            <Label>Current Images</Label>
            {images.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No images available for this destination.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image) => (
                  <div
                    key={image.image_id}
                    className={`relative rounded-md border p-2 ${destination.thumbnail === image.image_url ? "ring-2 ring-primary" : ""
                      }`}
                  >
                    {editImageId === image.image_id ? (
                      <div className="space-y-2">
                        <Input
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          placeholder="Enter image URL"
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveEdit} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="relative h-40 w-full mb-2">
                          <Image
                            src={image.image_url || "/placeholder.svg"}
                            alt={`Image ${image.image_id}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex justify-end items-center">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditImage(image.image_id)}
                              disabled={isSubmitting}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteImage(image.image_id)}
                              disabled={isSubmitting}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
