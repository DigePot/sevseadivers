import { useGetRentalQuery } from "../../../../store/rental"
import type { Rental } from "../../../../types/rental"

export const useRental = (id: string) => {
  const { data, error, isLoading } = useGetRentalQuery(id)
  const rental: Rental | null = (data as any)?.data?.rental ?? null

  return { rental, isLoading, error }
}
