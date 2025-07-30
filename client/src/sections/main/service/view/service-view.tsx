import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSwimmer,
  FaWater,
  FaLeaf,
  FaBookOpen,
  FaUmbrellaBeach,
} from "react-icons/fa";

const services = [
  {
    title: "Scuba Diving",
    icon: FaSwimmer,
    desc: "Explore the beautiful reefs and marine life with our professional diving team.",
    details: [
      "Fun Dives (Daily Trips)",
      "Night Dives",
      "Deep Dives",
      "Private Diving Experience",
    ],
  },
  {
    title: "Snorkeling",
    icon: FaWater,
    desc: "Enjoy guided snorkeling trips to discover colorful coral gardens and tropical fish.",
    details: [
      "Group Snorkeling Tours",
      "Private Snorkeling",
      "Family Snorkeling Packages",
    ],
  },
  {
    title: "Marine Conservation",
    icon: FaLeaf,
    desc: "Join our ocean protection and clean-up programs.",
    details: [
      "Volunteer activities",
      "Educational sessions",
      "Eco-focused efforts",
      "Community engagement",
    ],
  },
  {
    title: "Diving Courses",
    icon: FaBookOpen,
    desc: "Get certified with our professional training.",
    details: [
      "Beginner to pro",
      "International license",
      "Skilled instructors",
      "Flexible schedules",
    ],
  },
  {
    title: "Beach & Boat Trips",
    icon: FaUmbrellaBeach,
    desc: "Relax on the beach or enjoy boat excursions.",
    details: [
      "Day trips",
      "Private boats",
      "Food & music",
      "Scenic views",
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
  hover: {
    scale: 1.04,
    boxShadow: "0 8px 30px rgba(14,165,233,0.15)",
    transition: { duration: 0.3 },
  },
};

export function ServiceView() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const toggleExpand = (index: number) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl select-none transition-colors">
      <motion.h2
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-5xl font-extrabold text-center text-blue-900 dark:text-white mb-10 tracking-wide drop-shadow-lg font-sans"
      >
        Our <span className="text-cyan-500">Services</span>
      </motion.h2>

      <p className="max-w-3xl mx-auto text-center text-lg text-blue-800 dark:text-gray-300 mb-16 font-medium font-sans leading-relaxed">
        Welcome to{" "}
        <span className="font-bold text-cyan-600 dark:text-cyan-400">SEVSEA DIVERS</span>,
        your gateway to the underwater world of Somalia. We offer top-tier diving and marine adventures to create memories that last forever.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isOpen = expandedIndex === index;

          return (
            <motion.article
              key={index}
              className="relative bg-white dark:bg-white/5 bg-opacity-80 backdrop-blur-md rounded-3xl p-6 cursor-pointer border border-transparent shadow-md hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:border-cyan-400 transition-all duration-300"
              tabIndex={0}
              role="button"
              aria-expanded={isOpen}
              aria-controls={`service-details-${index}`}
              onClick={() => toggleExpand(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleExpand(index);
                }
              }}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              <motion.div
                className="flex justify-center mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 rounded-full p-5 shadow-md text-white text-5xl">
                  <Icon />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                className="text-xl font-semibold text-center mb-3 text-blue-900 dark:text-white tracking-wide"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {service.title}
              </motion.h3>

              {/* Description */}
              <p className="text-center text-blue-800 dark:text-gray-300 text-sm mb-5 px-1">
                {service.desc}
              </p>

              {/* Learn More Button */}
              <div className="flex justify-center">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(index);
                  }}
                  aria-expanded={isOpen}
                  aria-controls={`service-details-${index}`}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-cyan-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isOpen ? "Show Less" : "Learn More"}
                </motion.button>
              </div>

              {/* Details Accordion */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    id={`service-details-${index}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-sm text-blue-900 dark:text-gray-200 px-5 mt-4 border-t border-cyan-300 pt-4"
                  >
                    <ul className="list-disc list-inside space-y-1 font-medium">
                      {service.details.map((detail, i) => (
                        <li
                          key={i}
                          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
