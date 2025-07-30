import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa"
import { Link, useNavigate } from "react-router"

// --- Logo Import ---
// Make sure the path and filename 'logo.png' are correct.
import Logo from "../../assets/logo.png"

import LanguageSwitcher from "../../components/LanguageSwitcher"
import { SignInButton } from "../../components/sign-in-button"
import { SignOutButton } from "../../components/sign-out-button"
import Footer from "../../layouts/footer/Footer"
import { useAuth, useUser } from "../../sections/auth/hooks"
import { navData as mainNavData } from "../nav-config-main"
import { CONFIG } from "../../global-config"

// ==========================================================================
// 1. Child Components (Refactored for Reusability & Clarity)
// ==========================================================================

// --- Profile Menu ---
const ProfileMenu = ({ user, onClose }: { user: any; onClose: () => void }) => {
  console.log("user", user)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleProfileClick = () => {
    onClose()
    navigate("/profile")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
    >
      <div className="p-2">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {user?.email || "User"}
          </p>
        </div>
        <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
        <button
          onClick={handleProfileClick}
          className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-cyan-500 hover:text-white rounded-md transition-colors duration-150"
        >
          {t("profileMenu.profile")}
        </button>
        <SignOutButton
          onClick={onClose}
          className="w-full mt-1 text-white bg-cyan-600 hover:bg-cyan-700 transition rounded-md"
        >
          {t("profileMenu.signOut")}
        </SignOutButton>
      </div>
    </motion.div>
  )
}

// --- Desktop Navigation ---
const DesktopNav = () => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center space-x-6 font-semibold tracking-wide">
      {mainNavData.map(({ path, title }) => (
        <Link
          key={path}
          to={path}
          className="relative group px-2 py-1 transition text-lg text-gray-700 dark:text-gray-300 hover:text-cyan-600"
        >
          {t(title)}
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full rounded"></span>
        </Link>
      ))}
    </div>
  )
}

// --- Mobile Navigation ---
const MobileNav = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation()
  const { authenticated } = useAuth()
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 w-full max-w-sm h-full bg-white dark:bg-gray-900 shadow-lg z-50 flex flex-col p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-cyan-600">Menu</span>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={t("header.toggleMenu")}
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-4 flex-grow">
              {mainNavData.map(({ path, title }) => (
                <button
                  key={path}
                  onClick={() => handleNavigate(path)}
                  className="text-left text-2xl text-gray-800 dark:text-gray-200 hover:text-cyan-600 transition-colors py-2"
                >
                  {t(title)}
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              {authenticated ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handleNavigate("/profile")}
                    className="w-full text-left block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  >
                    {t("profileMenu.profile")}
                  </button>
                  <SignOutButton onClick={onClose} className="w-full">
                    {t("profileMenu.signOut")}
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton onClick={onClose} className="w-full" />
              )}
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// --- Header ---
const Header = () => {
  const { t } = useTranslation()
  const { authenticated } = useAuth()
  const id = localStorage.getItem("id") ?? ""
  const { user } = useUser(id)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={Logo}
                alt={`${CONFIG.appName} Logo`}
                className="h-30 w-auto transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
              <DesktopNav />
            </nav>

            {/* Right-side controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageSwitcher />

              {/* Profile Menu (Desktop) */}
              <div className="hidden md:block relative" ref={profileMenuRef}>
                {authenticated ? (
                  <>
                    <motion.button
                      onClick={() => setProfileMenuOpen((p) => !p)}
                      className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      whileTap={{ scale: 0.95 }}
                      aria-haspopup="true"
                      aria-expanded={profileMenuOpen}
                      title={t("header.userMenuTitle")}
                    >
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="pic"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-gray-500 dark:text-gray-300" />
                      )}
                    </motion.button>
                    <AnimatePresence>
                      {profileMenuOpen && (
                        <ProfileMenu
                          user={user}
                          onClose={() => setProfileMenuOpen(false)}
                        />
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <SignInButton />
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 -mr-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:hidden"
                aria-label={t("header.toggleMenu")}
              >
                <FaBars size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

// ==========================================================================
// 2. Main Layout Component (The Top-Level Structure)
// ==========================================================================
interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <Footer />
    </div>
  )
}
