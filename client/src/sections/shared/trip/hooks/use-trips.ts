import { useGetTripsQuery } from "../../../../store/trip"
import type { Trip } from "../../../../types/trip"

export const useTrips = () => {
  const { data, error, isLoading } = useGetTripsQuery()
  const allTrips: Trip[] = data || [] // Fix: Provide default empty array

  return { allTrips, error, isLoading }
}
