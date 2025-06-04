"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { saveUserToStorage, uploadImageUser, deleteImageUser, updateUserProfile, changePassword, getUserFromStorage } from "@/lib/auth"
import type { User } from "@/types/user"

type ProfileFormProps = {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone_number: user.phone_number || "",
    gender: user.gender || "prefer-not-to-say",
    date_of_birth: user.date_of_birth ? formatDateForInput(new Date(user.date_of_birth)) : "",
    profile_image: user.profile_image || "/diverse-group.png",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const { toast } = useToast()

  function formatDateForInput(date: Date): string {
    const offset = date.getTimezoneOffset()
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
    return adjustedDate.toISOString().split('T')[0]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'date_of_birth') {
      const selectedDate = new Date(value)
      const offset = selectedDate.getTimezoneOffset()
      const adjustedDate = new Date(selectedDate.getTime() + (offset * 60 * 1000))
      setFormData(prev => ({ ...prev, [name]: value }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're currently editing, cancel the edit
      setFormData({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number || "",
        gender: user.gender || "prefer-not-to-say",
        date_of_birth: user.date_of_birth ? formatDateForInput(new Date(user.date_of_birth)) : "",
        profile_image: user.profile_image || "/diverse-group.png",
      })
    }
    setIsEditing(!isEditing)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updatedProfile = await updateUserProfile({
        user_id: user.user_id,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        profile_image: formData.profile_image
      })

      if (updatedProfile) {
        // Cập nhật lại formData với dữ liệu mới
        setFormData({
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone_number: updatedProfile.phone_number || "",
          gender: updatedProfile.gender || "prefer-not-to-say",
          date_of_birth: updatedProfile.date_of_birth ? formatDateForInput(new Date(updatedProfile.date_of_birth)) : "",
          profile_image: updatedProfile.profile_image || "/diverse-group.png",
        })

        toast({
          title: "Profile updated",
          description: "Your personal information has been updated successfully."
        })
        setIsEditing(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating profile",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if(passwordData.current_password !== user.password){
      toast({
        title: "Passwords don't match",
        description: "Your current password is incorrect.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // const user = getUserFromStorage()
      // Gọi API change password
      const success = await changePassword({
        user_id: user.user_id,
        new_password: passwordData.new_password
      })

      if (success) {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        })

        // Reset form
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        })
        setIsChangingPassword(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to update password. Please check your current password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while updating password",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload the file to a server
      let response = await uploadImageUser(file)
      // For now, we'll just create a local URL
      // const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, profile_image: response.filename }))
      // console.log(imageUrl)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>View and update your personal details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <div className="relative h-32 w-32">
                <Image
                  src={formData.profile_image || "/placeholder.svg"}
                  alt={formData.name}
                  fill
                  className="rounded-full object-cover"
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <Label
                      htmlFor="profile-image"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Upload profile image</span>
                    </Label>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  disabled={!isEditing}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">
                      Other
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                    <Label htmlFor="prefer-not-to-say" className="cursor-pointer">
                      Prefer not to say
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={handleEditToggle}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                  id="current_password"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardFooter>
            <Button type="button" onClick={() => setIsChangingPassword(true)}>
              Change Password
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
