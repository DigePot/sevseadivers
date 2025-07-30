import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

export default function StorySection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:px-12 md:px-20 lg:px-32 bg-white">
      {/* Background blur circles */}
      <div className="absolute top-[-150px] right-[-150px] w-[400px] h-[400px] bg-cyan-200 opacity-20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-indigo-100 opacity-20 rounded-full blur-3xl z-0" />

      <motion.div
        className="relative z-10 grid lg:grid-cols-2 gap-16 items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Icon with shimmer gradient */}
        <motion.div
          className="flex justify-center lg:justify-start"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
        >
          <div className="bg-gradient-to-tr from-cyan-400 to-indigo-600 p-8 rounded-full shadow-2xl">
            <FaBookOpen className="text-white text-6xl drop-shadow-xl animate-pulse" />
          </div>
        </motion.div>

        {/* Text content */}
        <div className="text-center lg:text-left">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Our Story
          </motion.h2>

          <motion.p
            className="text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Sevsea Divers was founded by passionate ocean lovers who wanted to share the beauty and importance of the underwater world with everyone. Our journey began on the shores of a small island and has grown into a thriving community of divers, explorers, and conservationists.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
