
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";

export default function VisionSection() {
  return (
    <motion.section
      className="mb-12 bg-cyan-50 rounded-xl p-8 shadow text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-center mb-2">
        <FaEye className="text-cyan-600 text-3xl" />
      </div>
      <h2 className="text-2xl font-semibold text-cyan-600 mb-2">Our Vision</h2>
      <p className="text-gray-700">
        To be a leader in ocean conservation and diving education, fostering a global community of ocean advocates.
      </p>
    </motion.section>
  );
} 