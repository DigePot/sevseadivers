import { useGetOneStaffQuery } from "../../../../store/admin/admin"
import type { Staff } from "../../../../types/staff"

export const useOneStaff = (id: string) => {
  const { data, error, isLoading } = useGetOneStaffQuery(id)
  const staff: Staff | null = data || null

  return { staff, error, isLoading }
}
