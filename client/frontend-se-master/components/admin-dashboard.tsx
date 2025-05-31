"use client"

import { useState } from "react"
import AdminHeader from "@/components/admin-header"
import DestinationsTable from "@/components/destinations-table"
import Footer from "@/components/footer"

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader onSearch={handleSearch} />
      <main className="flex-1 overflow-x-hidden p-6">
        <DestinationsTable searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  )
}
