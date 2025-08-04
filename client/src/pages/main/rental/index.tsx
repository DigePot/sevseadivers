import React from "react"
import { motion } from "framer-motion"
import { FiMapPin, FiCheck } from "react-icons/fi"

export function RentalView() {
  const equipmentList = [
    { name: "BCD", price: "$10", image: "/equipment/bcd.jpg", location: "Mogadishu", duration: "1–2 hours" },
    { name: "Mask & Snorkel", price: "$5", image: "/equipment/mask-snorkel.jpg", location: "Bosaso", duration: "1–3 hours" },
    { name: "Fins", price: "$5", image: "/equipment/fins.jpg", location: "Kismayo", duration: "1–2 hours" },
    { name: "Wetsuit", price: "$8", image: "/equipment/wetsuit.jpg", location: "Mogadishu", duration: "1–4 hours" },
    { name: "Dive Tank", price: "$10", image: "/equipment/dive-tank.jpg", location: "Bosaso", duration: "2–3 hours" },
    { name: "Regulator Set", price: "$12", image: "/equipment/regulator.jpg", location: "Kismayo", duration: "1–3 hours" },
    { name: "Full Equipment Set", price: "$40", image: "/equipment/full-set.jpg", location: "Mogadishu", duration: "3–5 hours" },
  ].filter(item => item.name && item.image && item.price) // <- filter out bad data

  return (
    <section className="relative bg-gradient-to-tr from-cyan-100 via-white to-cyan-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 md:px-12 py-24 rounded-3xl max-w-7xl mx-auto shadow-xl space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-700 to-blue-600 bg-clip-text text-transparent drop-shadow-lg select-none">
          🧰 Rent Your Diving Gear
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 tracking-wide leading-relaxed max-w-xl mx-auto">
          Dive ready with premium, top-quality rental gear at all SEVSEA DIVERS branches. Reserve your equipment hassle-free!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-10">
        {equipmentList.map((item, idx) => {
          const { name, price, image, location, duration } = item || {}
          return (
            <motion.div
              key={`equipment-${idx}`}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)",
                borderColor: "rgba(14, 165, 233, 0.7)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-2 border-transparent hover:border-cyan-500 flex flex-col md:flex-row overflow-hidden cursor-pointer"
            >
              <div className="flex flex-col justify-between p-8 flex-grow space-y-5">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {location && (
                    <span className="flex items-center gap-2 bg-cyan-100 text-cyan-700 dark:bg-cyan-800 dark:text-cyan-300 rounded-full px-4 py-1 text-sm font-medium select-none">
                      <FiMapPin aria-hidden="true" /> {location}
                    </span>
                  )}
                  {duration && (
                    <span className="flex items-center gap-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300 rounded-full px-4 py-1 text-sm font-medium select-none">
                      <FiCheck aria-hidden="true" /> {duration}
                    </span>
                  )}
                </div>

                <button
                  className="mt-6 w-max px-6 py-3 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white font-semibold rounded-full shadow-md transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                  aria-label={`Rent ${name}`}
                >
                  Book Now
                </button>
              </div>

              {/* Image side */}
              {image && (
                <img
                  src={image}
                  alt={`${name} rental equipment`}
                  loading="lazy"
                  className="w-full md:w-80 h-56 md:h-auto object-cover rounded-tr-3xl rounded-br-3xl"
                />
              )}

              {/* Price badge */}
              {price && (
                <div className="absolute top-6 right-6 bg-cyan-600 text-white font-bold text-xl select-none px-4 py-1 rounded-full shadow-lg">
                  {price}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
