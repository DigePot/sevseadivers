import { useState, useEffect } from "react"

import { useRouter, useSearchParams } from "../../../routes/hooks"

import { CONFIG } from "../../../global-config"
import { useAuth } from "../hooks"

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter()

  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo") || CONFIG.auth.redirectPath

  const { loading, authenticated } = useAuth()

  const [isChecking, setIsChecking] = useState<boolean>(true)

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return
    }

    if (authenticated) {
      router.replace(returnTo)
      return
    }

    setIsChecking(false)
  }

  useEffect(() => {
    checkPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading])

  if (isChecking) {
    return <div>SplashScreen</div>
  }

  return <>{children}</>
}
