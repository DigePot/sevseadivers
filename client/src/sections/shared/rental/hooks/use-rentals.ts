import { useGetRentalsQuery } from "../../../../store/rental"
import type { Rental } from "../../../../types/rental"

export const useRentals = () => {
  const { data, isLoading, error } = useGetRentalsQuery()
  const allRentals: Rental[] = data?.data?.rentals ?? []
  console.log("data", data)

  return { allRentals, error, isLoading }
}
