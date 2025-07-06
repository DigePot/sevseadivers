import React from "react"
import { navData as mainNavData } from "../nav-config-main"
import { CONFIG } from "../../global-config"
import { SignInButton } from "../../components/sign-in-button"
import { SignUpButton } from "../../components/sign-up-button"
import { Link } from "react-router"
import { useAuth, useUser } from "../../sections/auth/hooks"
import { SignOutButton } from "../../components/sign-out-button"

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const id = localStorage.getItem("id") ?? ""
  const { user } = useUser(id)
  const { authenticated } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border border-[#E5E8EB]  text-[#121717] p-4 flex justify-between items-center">
        <Link className="text-xl font-bold" to="/">
          {CONFIG.appName}
        </Link>
        <nav className=" flex items-center gap-4">
          <div className="space-x-4">
            {mainNavData.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="hover:text-[#1AB2E5] font-bold text-base"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {authenticated ? (
              <>
                <h1 className="text-black">{user?.fullName}</h1>
                <SignOutButton />
              </>
            ) : (
              <>
                <SignInButton />
                <SignUpButton />
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} {CONFIG.appName}. All rights reserved.
      </footer>
    </div>
  )
}
