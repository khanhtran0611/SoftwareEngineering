"use client"

import { useState } from "react"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import DestinationGrid2 from "./destination-grid2"

export default function CustomerDashboard2() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    location: "",
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearch={handleSearch} onFilter={handleFilter} />
      <div className="flex flex-1">
        <Navigation />
        <main className="flex-1 overflow-x-hidden p-6">
          <DestinationGrid2 searchQuery={searchQuery} filters={filters} />
        </main>
      </div>
      <Footer />
    </div>
  )
}
