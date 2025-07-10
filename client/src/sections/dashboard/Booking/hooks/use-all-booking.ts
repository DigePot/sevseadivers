import { useGetAllBookingQuery } from "../../../../store/admin"
import type { Booking } from "../../../../types/booking"

export const useAllBooking = () => {
  const { data, error, isLoading } = useGetAllBookingQuery()
  const allBooking: Booking[] = data || []

  return { allBooking, error, isLoading }
}
