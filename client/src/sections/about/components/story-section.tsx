
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

export default function StorySection() {
  return (
    <motion.section
      className="mb-12 text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-center mb-2">
        <FaBookOpen className="text-cyan-600 text-3xl" />
      </div>
      <h2 className="text-2xl font-semibold text-cyan-600 mb-2">Our Story</h2>
      <p className="text-gray-700">
        Sevsea Divers was founded by passionate ocean lovers who wanted to share the beauty and importance of the underwater world with everyone. Our journey began on the shores of a small island and has grown into a thriving community of divers, explorers, and conservationists.
      </p>
    </motion.section>
  );
} 