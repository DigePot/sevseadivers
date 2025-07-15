import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";

export default function VisionSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:px-12 md:px-20 lg:px-32 bg-white">
      {/* Background Blur Circles */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-indigo-200 opacity-20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-cyan-100 opacity-20 rounded-full blur-3xl z-0" />

      {/* Grid Layout */}
      <motion.div
        className="relative z-10 grid lg:grid-cols-2 gap-16 items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Icon + Title */}
        <div className="text-center lg:text-left">
          <motion.div
            className="inline-block bg-gradient-to-tr from-indigo-500 to-cyan-600 p-6 rounded-full shadow-xl mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
          >
            <FaEye className="text-white text-5xl" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Our Vision
          </h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-cyan-500 mb-6 rounded-full mx-auto lg:mx-0"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.7 }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Description Text */}
        <motion.p
          className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          To be a global leader in ocean conservation and diving education —
          empowering a new wave of ocean advocates, explorers, and educators
          who protect and celebrate marine ecosystems worldwide.
        </motion.p>
      </motion.div>
    </section>
  );
}
