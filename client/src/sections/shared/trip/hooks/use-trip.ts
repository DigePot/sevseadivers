import { useGetTripQuery } from "../../../../store/trip"
import type { Trip } from "../../../../types/trip"

export const useTrip = (id: string) => {
  const { data, error, isLoading } = useGetTripQuery(id)
  const Trip: Trip | null = data || null

  return { Trip, error, isLoading }
}
