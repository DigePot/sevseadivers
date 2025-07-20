import { useGetAllStaffQuery } from '../../../store/staff';

export function useStaff() {
  const { data: staff = [], isLoading, isError, error } = useGetAllStaffQuery();
  return { staff, isLoading, isError, error };
}
