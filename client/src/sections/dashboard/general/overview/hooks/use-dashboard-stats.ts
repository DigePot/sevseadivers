import { useGetDashboardStatsQuery } from "../../../../../store/admin"
import type { DashboardStats } from "../../../../../types/dashboard-stats"

export const useDashboardStats = () => {
  const { data, error, isLoading } = useGetDashboardStatsQuery()
  const dashboardStats: DashboardStats | null = data || null

  return { dashboardStats, error, isLoading }
}
