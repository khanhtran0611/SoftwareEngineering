"use client";

import { useState, useEffect } from "react";
import DestinationCard from "@/components/destination-card";
import { getAllDestinations, getFilteredDestinations, getDestinationById } from "@/lib/destination";
import type { Destination } from "@/types/destination";

type DestinationGridProps = {
  searchQuery: string;
  filters: {
    minPrice: number;
    maxPrice: number;
    location: string;
  };
  recommendedDestinationIds?: number[]; // Add recommended destination IDs as a prop
};

export default function DestinationGrid({ searchQuery, filters, recommendedDestinationIds }: DestinationGridProps) {
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [recommendedDestinations, setRecommendedDestinations] = useState<Destination[]>([]); // State for recommended destinations
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true); // Loading state for recommended destinations

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        if (!searchQuery && !filters.location && filters.minPrice === 0 && filters.maxPrice === Infinity) {
          const allDestinations = await getAllDestinations();
          setFilteredDestinations(allDestinations);
        } else {
          const filteredResults = await getFilteredDestinations({
            searchQuery,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            location: filters.location,
          });
          setFilteredDestinations(filteredResults);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, [searchQuery, filters]);

  useEffect(() => {
    const fetchRecommendedDestinations = async () => {
      if (!recommendedDestinationIds || recommendedDestinationIds.length === 0) {
        setRecommendedDestinations([]);
        setIsLoadingRecommended(false);
        return;
      }

      try {
        setIsLoadingRecommended(true);
        const destinations = await Promise.all(
          recommendedDestinationIds.map((id) => getDestinationById(id))
        );
        setRecommendedDestinations(destinations);
      } catch (error) {
        console.error("Error fetching recommended destinations:", error);
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommendedDestinations();
  }, [recommendedDestinationIds]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading destinations...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Popular Destinations</h1>
      {filteredDestinations.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No destinations found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria to find destinations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination.destination_id} destination={destination} />
          ))}
        </div>
      )}

      <h1 className="mt-12 mb-6 text-2xl font-bold">Recommended Destinations</h1>
      {isLoadingRecommended ? (
        <div className="flex items-center justify-center p-8">
          <p>Loading recommended destinations...</p>
        </div>
      ) : recommendedDestinations.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No recommended destinations found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {recommendedDestinations.map((destination) => (
            <DestinationCard key={destination.destination_id} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}