import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaTiktok,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa";

const socialLinks = [
  { icon: FaFacebook, href: "https://www.facebook.com/share/1FXqHop7fP/?mibextid=wwXIfr", label: "Facebook" },
  { icon: FaTwitter, href: "https://x.com/sevseadivers?s=21", label: "Twitter" },
  { icon: FaInstagram, href: "https://www.instagram.com/sevseadivers?igsh=MXdtcDg5eWZwd2QzMw%3D%3D&utm_source=qr", label: "Instagram" },
  { icon: FaTiktok, href: "https://www.tiktok.com/@sevsea.divers?_t=ZM-8wXxWNAwMY2&_r=1", label: "TikTok" },
];

const linksGroup = [
  {
    title: "Products",
    links: [
      { label: "Diving Courses", href: "/courses" },
      { label: "Our services", href: "/services" },
      { label: "Guided Tours", href: "/trips" },
    ],
  },
  {
    title: "Useful Links",
    links: [
      { label: "Your Account", href: "/auth/sign-in" },
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us" },
      { label: "Help", href: "/contact-us" },
    ],
  },
];

const contactInfo = [
  { icon: FaMapMarkerAlt, text: "Jazeera Beach, Mogadishu, Somalia" },
  { icon: FaEnvelope, text: "info@sevseadivers.com" },
  { icon: FaPhone, text: "+252 615 225057 " },
];

const Footer: React.FC = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full
                 relative bg-black
                 text-gray-200 border-t border-gray-700
                 px-10 sm:px-16 lg:px-24 py-20
                 backdrop-blur-md bg-black/90
                 shadow-xl"
    >
      {/* Top Social Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 space-y-6 md:space-y-0 max-w-[1600px] mx-auto">
        <span className="font-semibold text-xl md:text-2xl tracking-wide">
          Connect with us on social networks!
        </span>
        <div className="flex space-x-8 text-3xl">
          {socialLinks.map(({ icon: Icon, href, label }, idx) => (
            <motion.a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              whileHover={{ scale: 1.3, rotateY: 15, color: "#22d3ee", textShadow: "0 0 8px #22d3ee" }}
              whileTap={{ scale: 0.95, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              <Icon />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-14 max-w-[1600px] mx-auto">
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          <h3 className="text-3xl font-extrabold text-cyan-400 tracking-wide">
            SEVSEA DIVERS
          </h3>
          <p className="text-gray-300 leading-relaxed font-light">
            Passionate ocean explorers dedicated to sharing the wonders of diving and ocean conservation.
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
            <h4 className="text-xl font-semibold text-cyan-400 mb-5">{title}</h4>
            <ul className="space-y-4">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    className="relative inline-block font-medium text-gray-300
                               transition-colors duration-300
                               hover:text-cyan-300
                               after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
                               after:bg-cyan-300 hover:after:w-full after:transition-all after:duration-300
                               transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                    whileHover={{ rotateY: 10 }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    aria-label={label}
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
          <h4 className="text-xl font-semibold text-cyan-400 mb-5">Contact</h4>
          <ul className="space-y-5 text-gray-300 text-sm font-light">
            {contactInfo.map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-center gap-4">
                <Icon className="text-cyan-400 text-lg flex-shrink-0" />
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
        className="mt-20 text-center text-xs text-gray-500 select-none max-w-[1600px] mx-auto"
      >
        &copy; {new Date().getFullYear()} Sevsea Divers. All rights reserved.
      </motion.div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            whileHover={{ scale: 1.2 }}
            className="fixed bottom-8 right-8 bg-cyan-600 p-3 rounded-full shadow-lg text-white focus:outline-none focus:ring-4 focus:ring-cyan-400 transition-transform"
          >
            <FaArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.footer>
  );
};

export default Footer;
