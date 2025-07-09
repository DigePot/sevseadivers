export interface DashboardStats {
  overview: {
    totalUsers: number
    totalBookings: number
    totalCourses: number
    totalServices: number
    totalTrips: number
    totalGalleryItems: number
  }
  growth: {
    currentMonthBookings: number
    lastMonthBookings: number
    bookingGrowth: string
  }
  recent: {
    bookings: Array<{
      id: number
      status: string
      bookingDate: string
      createdAt: string
      updatedAt: string
      userId: number
      courseId: number
      User: {
        username: string
        fullName: string
      }
      Course: {
        title: string
      }
    }>
    users: Array<{
      id: number
      username: string
      fullName: string
      email: string
      role: string
      createdAt: string
    }>
  }
}
