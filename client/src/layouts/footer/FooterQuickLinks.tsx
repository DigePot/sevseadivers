import React from "react"
import { footerLinks } from "./footer.config"
import { Link } from "react-router"
import { motion } from "framer-motion"

const FooterQuickLinks: React.FC = () => (
  <motion.nav
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    aria-label="Quick Links"
  >
    <h3 className="font-semibold mb-4 text-cyan-600 text-lg tracking-wide">
      Quick Links
    </h3>
    <ul className="space-y-3">
      {footerLinks.map(({ label, href }) => (
        <li key={label}>
          <Link
            to={href}
            className="text-gray-600 dark:text-gray-300 font-medium transition
                       hover:text-cyan-600 focus:text-cyan-600 focus:outline-none
                       transform hover:scale-105 focus:scale-105 duration-300"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </motion.nav>
)

export default FooterQuickLinks
