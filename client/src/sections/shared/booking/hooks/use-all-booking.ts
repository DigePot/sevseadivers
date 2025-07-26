import { useGetAllBookingQuery } from "../../../../store/booking"
import type { Booking } from "../../../../types/booking"

export const useAllBooking = () => {
  const { data, error, isLoading, refetch } = useGetAllBookingQuery()
  const allBooking: Booking[] = data || []

  return { allBooking, refetch, error, isLoading }
}
