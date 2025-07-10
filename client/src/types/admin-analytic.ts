export interface AdminAnalytics {
  period: "month"
  bookingsByPeriod: Array<{
    date: string
    count: number
  }>
  usersByPeriod: Array<{
    date: string
    count: number
  }>
  revenue: {
    total: number
    average: number
  }
  topCourses: Array<{
    bookingCount: number
    Course: {
      title: string
      price: number
    }
  }>
  userRoles: Array<{
    role: string
    count: number
  }>
}
