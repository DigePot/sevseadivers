import { useState, useRef } from "react";
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
    desc: "Explore the mesmerizing reefs and marine life with our certified dive professionals.",
    details: ["Fun Dives", "Night Dives", "Deep Water", "Private Dives"],
    longDesc:
      "Join us for unforgettable scuba diving adventures exploring vibrant coral reefs and abundant marine life. Certified dive professionals will guide you through safe and exciting underwater experiences, suitable for all levels.",
  },
  {
    title: "Snorkeling",
    icon: FaWater,
    desc: "Discover coral gardens and marine life with our snorkeling guides.",
    details: ["Group Tours", "Private Snorkel", "Family Packages"],
    longDesc:
      "Our snorkeling tours offer a relaxing way to experience the underwater beauty without needing special training. Swim alongside colorful fish and explore coral gardens under the guidance of experienced snorkeling guides.",
  },
  {
    title: "Marine Conservation",
    icon: FaLeaf,
    desc: "Join our mission to protect marine ecosystems in Somalia.",
    details: ["Coral Restoration", "Beach Cleanups", "Citizen Science"],
    longDesc:
      "Contribute to preserving Somalia’s precious marine ecosystems by participating in coral restoration projects, beach cleanups, and citizen science programs. Help protect the ocean for future generations.",
  },
  {
    title: "Dive Courses",
    icon: FaBookOpen,
    desc: "Get certified with our range of beginner to advanced PADI courses.",
    details: ["Open Water", "Advanced Diver", "Rescue Diver", "Divemaster"],
    longDesc:
      "Get professionally certified through PADI with our comprehensive dive courses designed for all levels. From beginner Open Water to Divemaster, our instructors provide hands-on training and support.",
  },
  {
    title: "Youth Training",
    icon: FaUmbrellaBeach,
    desc: "Fun, safe, and educational programs designed for young adventurers.",
    details: ["Junior Open Water", "Ocean Discovery", "School Camps"],
    longDesc:
      "Our youth training programs are tailored for young adventurers to safely learn about the ocean, diving basics, and marine conservation through fun and educational activities.",
  },
];

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 50,
    scale: 0.8,
    transition: { delay: i * 0.15, ease: "easeOut" },
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: {
    scale: 1.05,
    boxShadow:
      "0 15px 25px rgba(59, 130, 246, 0.4), 0 0 12px rgba(59, 130, 246, 0.6)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  tap: { scale: 0.95 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.75, transition: { duration: 0.3 } },
};

export function ServiceView() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-sky-100 py-16 px-6 sm:px-16">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 drop-shadow-lg">
          Our Services
        </h1>
        <p className="text-lg md:text-xl text-blue-700 max-w-3xl mx-auto">
          Discover amazing ocean adventures and programs offered by{" "}
          <span className="font-semibold text-blue-900">SEVSEA DIVERS</span>.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {services.map(({ title, icon: Icon, desc, details }, i) => (
          <motion.div
            key={title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setSelectedService(title)}
            className="bg-white rounded-3xl p-8 cursor-pointer shadow-lg text-blue-900 flex flex-col justify-between min-h-[380px] relative border-4 border-blue-400 hover:border-blue-600 transition"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedService(title);
              }
            }}
            aria-label={`View more about ${title}`} // fixed template literal syntax here
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-blue-400/30 backdrop-blur-md flex items-center justify-center text-white drop-shadow-lg">
              <Icon className="text-7xl" aria-hidden="true" />
            </div>

            <div className="mt-20">
              <h2 className="text-3xl font-extrabold drop-shadow-md">{title}</h2>
              <p className="mt-3 text-blue-700 leading-relaxed">{desc}</p>
            </div>

            <ul className="mt-8 space-y-1 list-disc list-inside font-medium text-blue-800">
              {details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedService(title);
              }}
              aria-label={`Learn more about ${title}`} // fixed template literal syntax here
              className="mt-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full py-3 font-semibold tracking-wide shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
            >
              Learn More
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            key="modal"
            variantvis={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-blue-900/90 backdrop-blur-md flex items-center justify-center z-50 p-6"
            onClick={() => setSelectedService(null)}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-10 relative"
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
              tabIndex={-1}
            >
              <h2 className="text-4xl font-extrabold text-blue-900 mb-6 drop-shadow-md">
                {services.find((s) => s.title === selectedService)?.title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-line">
                {services.find((s) => s.title === selectedService)?.longDesc}
              </p>
              <ul className="mb-8 list-disc list-inside text-gray-800 space-y-1 font-medium">
                {services
                  .find((s) => s.title === selectedService)
                  ?.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
              </ul>
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 text-blue-600 hover:text-blue-900 text-5xl font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                aria-label="Close modal"
              >
                &times;
              </button>
              <button
                onClick={() => setSelectedService(null)}
                className="mt-4 w-full bg-blue-900 text-white rounded-3xl py-4 font-semibold tracking-wide hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
