import React, { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion } from "framer-motion"
import { FaChevronDown } from "react-icons/fa"

// Flags (small, round)
const SomaliFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    className="w-5 h-5 rounded-full object-cover"
    aria-hidden="true"
    role="img"
    aria-label="Somali Flag"
  >
    <rect width="900" height="600" fill="#4189DD" />
    <path
      d="M450 150l58.779 181.657h190.21l-153.89 112.26L599.1 556.18 450 443.82l-149.1 112.36 53.99-172.263-153.89-112.26h190.21L450 150z"
      fill="#fff"
    />
  </svg>
)

const EnglishFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 7410 3900"
    className="w-5 h-5 rounded-full object-cover"
    aria-hidden="true"
    role="img"
    aria-label="English Flag"
  >
    <path fill="#b22234" d="M0 0h7410v3900H0z" />
    <path
      d="M0 450h7410M0 1350h7410M0 2250h7410M0 3150h7410"
      stroke="#fff"
      strokeWidth="300"
    />
    <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
    <g fill="#fff">
      <g id="s18">
        <g id="s9">
          <path
            id="s5"
            d="M0-420L136.8-130.9 400.6-130.9 181.8 62.1 247.2 342.3 0 130.9-247.2 342.3-181.8 62.1-400.6-130.9-136.8-130.9z"
          />
          <use href="#s5" y="840" />
          <use href="#s5" y="1680" />
        </g>
        <use href="#s9" x="494" />
      </g>
      <use href="#s18" x="988" />
      <use href="#s18" x="1976" />
      <use href="#s18" x="2964" />
    </g>
  </svg>
)

type LanguageOption = {
  code: "en" | "so"
  label: string
  short: string
  flag: React.FC
}

const languageOptions: LanguageOption[] = [
  { code: "en", label: "English", short: "ENG", flag: EnglishFlag },
  { code: "so", label: "Soomaali", short: "SOM", flag: SomaliFlag },
]

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage =
    languageOptions.find((lang) => lang.code === i18n.language) || languageOptions[0]

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Select language and close dropdown
  const handleSelectLanguage = (code: "en" | "so") => {
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Button with short code + flag */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={{ scale: 0.95 }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition"
      >
        <currentLanguage.flag />
        <span>{currentLanguage.short}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-gray-400"
          aria-hidden="true"
        >
          <FaChevronDown />
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-32 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
            role="listbox"
          >
            {languageOptions.map(({ code, label, short, flag: Flag }) => (
              <li
                key={code}
                role="option"
                aria-selected={i18n.language === code}
                onClick={() => handleSelectLanguage(code)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-sm rounded-md
                  ${
                    i18n.language === code
                      ? "bg-cyan-600 text-white"
                      : "hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600"
                  }
                  transition-colors`}
              >
                <Flag />
                <span>{short}</span>
                <span className="sr-only"> - {label}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher
