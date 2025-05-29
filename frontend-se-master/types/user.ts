export type User = {
  user_id: number
  name: string
  email: string
  phone_number?: string
  gender?: string
  date_of_birth?: string
  role: "customer" | "admin" | "hotel owner"
  password?: string 
  profile_image?: string
}
