import React from "react";
import { motion } from "framer-motion";

const FooterCopyright: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="text-center text-gray-600 dark:text-gray-400 text-sm py-4 select-none font-light tracking-wide"
  >
    &copy; {new Date().getFullYear()} Sevsea Divers. All rights reserved.
  </motion.div>
);

export default FooterCopyright;
