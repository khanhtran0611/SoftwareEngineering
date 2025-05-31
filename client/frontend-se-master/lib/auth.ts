import type { User } from "@/types/user"
import { api } from "./api"
import { fileApi } from "./api"
// Mock user data with additional fields
export const mockUsers = [
  {
    user_id: 1,
    email: "customer@gmail.com",
    password: "123456",
    name: "John Doe",
    role: "customer" as const,
    phone_number: "+62 812 3456 7890",
    gender: "male",
    date_of_birth: "1990-05-15",
    profile_image: "/person-avatar-1.png",
  },
  {
    user_id: 2,
    email: "admin@travel.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
    phone_number: "+62 812 9876 5432",
    gender: "female",
    date_of_birth: "1985-03-20",
    profile_image: "/diverse-person-avatar-2.png",
  },
  {
    user_id: 3,
    email: "hotel@example.com",
    password: "hotel123",
    name: "Hotel Manager",
    role: "hotelOwner" as const,
    phone_number: "+62 812 1111 2222",
    gender: "male",
    date_of_birth: "1988-07-10",
    profile_image: "/person-avatar-3.png",
  },
]

// Types
export type AuthState = {
  user: User | null
  isAuthenticated: boolean
}

// Mock authentication functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await api.post('/login', { email, password });
    console.log({ email, password })
    return response as User; // giả định backend trả về đúng cấu trúc User
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

// Save user to localStorage
export const saveUserToStorage = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("travelUser", JSON.stringify(user))
  }
}

// Get user from localStorage
export const getUserFromStorage = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("travelUser")
    return user ? JSON.parse(user) : null
  }
  return null
}

// Remove user from localStorage
export const removeUserFromStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("travelUser")
  }
}

export async function uploadImageUser(file: File) {
  try {
    const formData = new FormData()
    formData.append('image', file)
    const response = await fileApi.post('/customer/upload-image-user', formData)
    return response
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export async function deleteImageUser(filename: string) {
  try {
    const response = await api.delete(`/customer/delete-image-user/${filename}`)
    return response.data
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

export const updateUserProfile = async (profileData: {
  user_id: number;
  name: string;
  email: string;
  phone_number?: string;
  gender?: string;
  date_of_birth?: string;
  profile_image?: string;
}): Promise<User | null> => {
  try {
    // if (profileData.profile_image) {
    //   const urlParts = profileData.profile_image.split('/')
    //   const filename = urlParts[urlParts.length - 1]
    //   profileData.profile_image = filename
    // }
    const response = await api.put('/customer/profileEditing', profileData);

    if (response.data) {
      removeUserFromStorage()
      saveUserToStorage(response.data);
    }

    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

// Function đổi mật khẩu
export const changePassword = async (passwordData: {
  current_password: string;
  new_password: string;
}): Promise<boolean> => {
  try {
    await api.put('/customer/change-password', passwordData);
    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
};

