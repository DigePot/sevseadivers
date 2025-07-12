import type { Course } from "./course"
import type { User } from "./user"

export interface Booking {
  id: number
  status: "pending" | "cancelled" | "completed"
  bookingDate: string
  createdAt: string
  updatedAt: string
  userId: number
  courseId: number | null
  User: User
  Course: Course | null
}
