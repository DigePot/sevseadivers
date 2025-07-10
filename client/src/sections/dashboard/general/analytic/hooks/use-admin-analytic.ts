import { useGetAdminAnalyticsQuery } from "../../../../../store/admin"
import type { AdminAnalytics } from "../../../../../types/admin-analytic"

export const useAdminAnalytic = () => {
  const { data, error, isLoading } = useGetAdminAnalyticsQuery()
  const adminAnalytics: AdminAnalytics | null = data || null

  return { adminAnalytics, error, isLoading }
}
