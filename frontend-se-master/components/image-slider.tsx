"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DestinationImage } from "@/types/image"

type ImageSliderProps = {
  images: DestinationImage[]
  title?: string
  height?: string
}

export default function ImageSlider({ images, title, height = "500px" }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToIndex = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
  }

  useEffect(() => {
    // Scroll the active thumbnail into view
    if (thumbnailsRef.current) {
      const thumbnails = thumbnailsRef.current.children
      if (thumbnails[currentIndex]) {
        thumbnails[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }

    // Reset transition state
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentIndex])

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center bg-muted rounded-lg" style={{ height }}>
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}

      {/* Main slider */}
      <div className="relative" style={{ height }}>
        <div ref={sliderRef} className="relative h-full w-full overflow-hidden rounded-lg">
          {images.map((image, index) => (
            <div
              key={image.image_id}
              className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={image.image_url || "/placeholder.svg"}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Navigation arrows */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full opacity-80 shadow-md transition-opacity hover:opacity-100"
            onClick={goToPrevious}
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full opacity-80 shadow-md transition-opacity hover:opacity-100"
            onClick={goToNext}
            disabled={isTransitioning}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div ref={thumbnailsRef} className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={image.image_id}
            className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md transition-all ${
              index === currentIndex ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => goToIndex(index)}
          >
            <Image
              src={image.image_url || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
