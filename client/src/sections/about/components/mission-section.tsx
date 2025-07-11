
import { motion } from "framer-motion";
import { FaBullseye } from "react-icons/fa";

export default function MissionSection() {
  return (
    <motion.section
      className="mb-12 bg-cyan-50 rounded-xl p-8 shadow text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-center mb-2">
        <FaBullseye className="text-cyan-600 text-3xl" />
      </div>
      <h2 className="text-2xl font-semibold text-cyan-600 mb-2">Our Mission</h2>
      <p className="text-gray-700">
        To inspire a love for the underwater world and make diving accessible, safe, and unforgettable for everyone.
      </p>
    </motion.section>
  );
} 