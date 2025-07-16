import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaCogs,
} from "react-icons/fa";

const divingCourses = [
  {
    title: "Discover Scuba Diving",
    price: "$80",
  },
  {
    title: "Open Water Diver Course",
    price: "$350",
  },
  {
    title: "Advanced Open Water Course",
    price: "$400",
  },
  {
    title: "Rescue Diver Course",
    price: "$450",
  },
  {
    title: "Divemaster Program",
    price: "$950",
  },
];

const equipmentServices = [
  {
    title: "Full Scuba Gear Rental",
    price: "$40/day",
  },
  {
    title: "Snorkeling Gear Rental",
    price: "$25/day",
  },
  {
    title: "Underwater Camera Rental",
    price: "$30/day",
  },
  {
    title: "Equipment Servicing & Tank Refills",
    price: "$20+",
  },
];

const listVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1 },
  }),
};

export function CourseView() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-6 sm:px-16 py-20">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-blue-900 drop-shadow-md"
        >
          🎓 Diving Courses
        </motion.h1>
        <p className="mt-4 text-lg text-blue-700">
          Learn to dive safely and confidently with internationally recognized certifications.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-12">
        {/* Diving Certifications */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl shadow-xl p-8 border-l-8 border-blue-500"
        >
          <div className="flex items-center gap-4 mb-6">
            <FaBookOpen className="text-blue-600 text-3xl" />
            <h2 className="text-2xl font-semibold text-blue-800">
              Diving Certifications
            </h2>
          </div>
          <ul className="space-y-4">
            {divingCourses.map((course, i) => (
              <motion.li
                key={i}
                custom={i}
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-between text-blue-800 text-lg border-b border-blue-100 pb-2"
              >
                <span>{course.title}</span>
                <span className="font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-sm">
                  {course.price}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Equipment Rental & Servicing */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl shadow-xl p-8 border-l-8 border-cyan-500"
        >
          <div className="flex items-center gap-4 mb-6">
            <FaCogs className="text-cyan-600 text-3xl" />
            <h2 className="text-2xl font-semibold text-cyan-800">
              Equipment Rental & Servicing
            </h2>
          </div>
          <ul className="space-y-4">
            {equipmentServices.map((service, i) => (
              <motion.li
                key={i}
                custom={i}
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-between text-cyan-800 text-lg border-b border-cyan-100 pb-2"
              >
                <span>{service.title}</span>
                <span className="font-bold text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full text-sm">
                  {service.price}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}