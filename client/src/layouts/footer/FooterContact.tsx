import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const FooterContact: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h3 className="font-semibold mb-4 text-cyan-600 text-xl tracking-wide">
      Contact
    </h3>
    <ul className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
      <li className="flex items-center gap-3 hover:text-cyan-600 transition-colors cursor-pointer">
        <FaEnvelope className="text-cyan-600 flex-shrink-0" />
        <span className="font-medium">Email:</span> info@sevsea.com
      </li>
      <li className="flex items-center gap-3 hover:text-cyan-600 transition-colors cursor-pointer">
        <FaPhone className="text-cyan-600 flex-shrink-0" />
        <span className="font-medium">Phone:</span> +1 (555) 123-4567
      </li>
      <li className="flex items-center gap-3 hover:text-cyan-600 transition-colors cursor-pointer">
        <FaMapMarkerAlt className="text-cyan-600 flex-shrink-0" />
        <span className="font-medium">Address:</span> 123 Ocean Drive, Beach City
      </li>
    </ul>
  </motion.div>
);

export default FooterContact;
