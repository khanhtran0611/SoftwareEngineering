"use client"

import ChatbotInterface from "@/components/chatbot-interface"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"

export default function ChatbotPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearch={() => {}} onFilter={() => {}} />
      <div className="flex flex-1">
        <Navigation />
        <main className="flex-1 p-4 md:p-6">
          <ChatbotInterface />
        </main>
      </div>
      <Footer />
    </div>
  )
}
