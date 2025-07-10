export interface User {
  id: number
  username: string
  password: string
  role: string
  email: string
  fullName: string
  phoneNumber: string
  profilePicture: string | null
  address: string | null
  dateOfBirth: string | null
  otp: string | null
  otpExpiry: string | null
  resetPasswordToken: string | null
  resetPasswordExpiry: string | null
  createdAt: string
  updatedAt: string
}
