
import { notFound } from "next/navigation"
import { destinations } from "@/data/destinations"
import DestinationDetails from "@/components/destination-details"
import { getDestinationById } from "@/lib/destination"

export default async function DestinationPage({ params }: { params: { id: string } }) {
  const destinationId = Number.parseInt(params.id)

  try {
    const destination = await getDestinationById(destinationId)
    if (!destination) {
      notFound()
    }

    return <DestinationDetails destination={destination} />
  } catch (error) {
    console.error('Error fetching destination:', error)
    notFound()
  }
}
