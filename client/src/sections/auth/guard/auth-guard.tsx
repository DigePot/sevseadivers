import { useEffect, useState } from "react"
import { paths } from "../../../routes/paths"
import { useAuth } from "../hooks"
import { usePathname, useRouter } from "../../../routes/hooks"
import { RoleBasedGuard } from "./role-based-guard"

// Type for allowed roles, must match the role-based guard
type AllowedRolesDT = "admin" | "staff" | "client"

type AuthGuardProps = {
  children: React.ReactNode
  allowedRoles?: AllowedRolesDT[] // Use AllowedRolesDT[] instead of string[]
}

const signInPaths = {
  jwt: paths.auth.jwt.signIn,
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { authenticated, loading, role } = useAuth()

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
      router.replace(redirectPath)
      return
    }

    if (allowedRoles && !allowedRoles.includes(role as AllowedRolesDT)) {
      router.replace(paths.forbidden)
      return
    }

    setIsChecking(false)
  }

  useEffect(() => {
    checkPermissions()
  }, [authenticated, loading, role])

  if (isChecking) {
    return <div>SplashScreen</div>
  }

  // If there are role restrictions, pass the children inside RoleBasedGuard
  if (allowedRoles) {
    return (
      <RoleBasedGuard allowedRoles={allowedRoles}>{children}</RoleBasedGuard>
    )
  }

  return <>{children}</>
}
