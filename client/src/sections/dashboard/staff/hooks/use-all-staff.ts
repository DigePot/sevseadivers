import { useGetAllStaffQuery } from "../../../../store/admin"
import type { Staff } from "../../../../types/staff"

export const useAllStaff = () => {
  const { data, error, isLoading } = useGetAllStaffQuery()
  const allStaff: Staff[] = data || []

  return { allStaff, error, isLoading }
}
