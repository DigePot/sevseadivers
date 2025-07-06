import { useGetUserQuery } from "../../../store/auth/auth"

export const useUser = (id: string) => {
  const { data, error, isLoading, refetch } = useGetUserQuery({ id })

  const user = data

  return { user, isLoading, error, refetch }
}
