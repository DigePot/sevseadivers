"use client"

import { useEffect, useState } from "react"

import { paths } from "../../../routes/paths"

import { useAuth } from "../hooks"
import { usePathname, useRouter } from "../../../routes/hooks"

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode
}

const signInPaths = {
  jwt: paths.auth.jwt.signIn,
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { authenticated, loading } = useAuth()

  const [isChecking, setIsChecking] = useState<boolean>(true)

  const createRedirectPath = (currentPath: string) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString()
    return `${currentPath}?${queryString}`
  }

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return
    }

    if (!authenticated) {
      const signInPath = signInPaths.jwt
      const redirectPath = createRedirectPath(signInPath)
      // alert(redirectPath)
      // console.log("redirectPath", redirectPath)

      router.replace(redirectPath)

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
