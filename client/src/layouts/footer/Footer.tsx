import React from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com" },
  { icon: FaTwitter, href: "https://twitter.com" },
  { icon: FaInstagram, href: "https://instagram.com" },
];

const linksGroup = [
  {
    title: "Products",
    links: [
      { label: "Diving Courses", href: "/courses" },
      { label: "Equipment Rental", href: "/services" },
      { label: "Guided Tours", href: "/trips" },
      { label: "Certification", href: "/services" },
    ],
  },
  {
    title: "Useful Links",
    links: [
      { label: "Your Account", href: "/auth/sign-in" },
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Help", href: "/help" },
    ],
  },
];

const contactInfo = [
  { icon: FaMapMarkerAlt, text: "123 Ocean Drive, Beach City" },
  { icon: FaEnvelope, text: "info@sevsea.com" },
  { icon: FaPhone, text: "+1 (555) 123-4567" },
];

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative bg-gradient-to-tr from-cyan-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
                 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700
                 px-8 py-20 max-w-7xl mx-auto rounded-t-xl
                 backdrop-blur-lg bg-white/30 dark:bg-gray-900/40 shadow-xl"
    >
      {/* Top Social Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 space-y-6 md:space-y-0">
        <span className="font-semibold text-xl md:text-2xl tracking-wide">
          Connect with us on social networks!
        </span>
        <div className="flex space-x-8 text-3xl">
          {socialLinks.map(({ icon: Icon, href }, idx) => (
            <motion.a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Social Link"
              whileHover={{ scale: 1.3, rotateY: 15 }}
              whileTap={{ scale: 0.95, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-400 dark:hover:text-cyan-300 cursor-pointer"
            >
              <Icon />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-14">
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          <h3 className="text-3xl font-extrabold text-cyan-600 tracking-wide">
            SEVSEA DIVERS
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            Passionate ocean explorers dedicated to sharing the wonders of diving
            and ocean conservation.
          </p>
        </motion.div>

        {/* Links Groups */}
        {linksGroup.map(({ title, links }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <h4 className="text-xl font-semibold text-cyan-600 mb-5">{title}</h4>
            <ul className="space-y-4">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    className="relative inline-block font-medium text-gray-700 dark:text-gray-300
                               transition-colors duration-300
                               hover:text-cyan-600
                               after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                               after:bg-cyan-600 hover:after:w-full after:transition-all after:duration-300
                               transform hover:scale-105"
                    whileHover={{ rotateY: 10 }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-5"
        >
          <h4 className="text-xl font-semibold text-cyan-600 mb-5">Contact</h4>
          <ul className="space-y-5 text-gray-700 dark:text-gray-300 text-sm font-light">
            {contactInfo.map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-center gap-4">
                <Icon className="text-cyan-600 dark:text-cyan-400 text-lg flex-shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-20 text-center text-xs text-gray-600 dark:text-gray-400 select-none"
      >
        &copy; {new Date().getFullYear()} Sevsea Divers. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
