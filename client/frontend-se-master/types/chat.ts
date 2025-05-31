export type ChatMessage = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export type ChatSession = {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}
