import type { Course } from "./course"
import type { User } from "./user"
import type { Trip } from "./trip"

export interface Booking {
  id: number
  status: "pending" | "cancelled" | "completed"
  bookingDate: string
  createdAt: string
  updatedAt: string
  userId: number
  courseId: number | null
  tripId?: number | null
  User: User
  Course: Course | null
  Trip?: Trip | null
  amount?: number
}
