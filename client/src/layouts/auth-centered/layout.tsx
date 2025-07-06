import React, { type ReactNode } from "react"
import { CONFIG } from "../../global-config"
import { Link } from "react-router"

interface AuthCenteredLayoutProps {
  children: ReactNode
}

export const AuthCenteredLayout: React.FC<AuthCenteredLayoutProps> = ({
  children,
}) => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between h-16 px-6 bg-white bg-opacity-50 backdrop-blur-sm z-10">
        <Link className="text-xl font-bold" to="/">
          {CONFIG.appName}
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/contact"
            className="hover:text-[#1AB2E5] font-bold text-base"
          >
            Need help?
          </Link>
        </div>
      </header>

      {/* Centered Content */}
      <main className="flex-1 flex items-center justify-center pt-16 px-4">
        <div>{children}</div>
      </main>

      {/* Footer (optional) */}
      <footer className="text-center py-4 text-sm text-black">
        &copy; {currentYear} {CONFIG.appName}. All rights reserved.
      </footer>
    </div>
  )
}
