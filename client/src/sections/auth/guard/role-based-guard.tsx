import React, { useEffect, useState } from "react"

import { useRouter } from "../../../routes/hooks/index"
import { useAuth } from "../hooks"

import { paths } from "../../../routes/paths"

type AllowedRolesDT = "admin" | "staff" | "client"

export function RoleBasedGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles: AllowedRolesDT[]
}) {
  const router = useRouter()

  const { role, loading } = useAuth()

  const [isChecking, setIsChecking] = useState<boolean>(true)

  useEffect(() => {
    if (!loading) {
      if (!role || !allowedRoles.includes(role as AllowedRolesDT)) {
        router.replace(paths.forbidden)
      } else {
        setIsChecking(false)
      }
    }
  }, [role, allowedRoles, loading, router])

  if (isChecking || loading) {
    return <div>SplashScreen</div>
  }

  return <>{children}</>
}
