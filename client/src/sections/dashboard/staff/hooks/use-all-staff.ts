import { useGetAllStaffQuery } from "../../../../store/admin"
import type { Staff } from "../../../../types/staff"

export const useAllStaff = () => {
  const { data, error, isLoading, refetch } = useGetAllStaffQuery()
  const allStaff: Staff[] = data || []

  return { allStaff, error, isLoading, refetch }
}
