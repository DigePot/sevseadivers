<<<<<<< HEAD:client/src/sections/home/view/home-view.tsx
import { Link } from "react-router";
import heroImg from "../../../assets/hero.jpg";
import { useTrips } from "../../trip/hooks/use-trips";
import { motion } from "framer-motion";
=======
import { Link } from "react-router"
import heroImg from "../../../../assets/hero.jpg"
import { useTrips } from "../../../trip/hooks/use-trips"
>>>>>>> feffd9d15a72edcacfb2c9cbd0602dc9db46c9bb:client/src/sections/main/home/view/home-view.tsx

export function HomeView() {
  const { allTrips } = useTrips()

  const featuredDestinations = allTrips
    ? (() => {
        const seen = new Set()
        const arr = []
        for (const trip of allTrips) {
          if (!seen.has(trip.destination)) {
            seen.add(trip.destination)
            arr.push({
              destination: trip.destination,
              imageUrl: trip.imageUrl,
              description: trip.description,
            })
            if (arr.length === 3) break
          }
        }
        return arr
      })()
    : []

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-screen bg-black text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-cyan-900/60 z-0" />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col justify-center items-center text-center px-6 py-16 md:py-28 min-h-screen max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
            Explore the Depths with <br />
            <span className="text-cyan-400">SEVSEA DIVERS</span>
          </h1>

<<<<<<< HEAD:client/src/sections/home/view/home-view.tsx
          <p className="mt-6 text-lg md:text-xl max-w-2xl text-white/90 drop-shadow-md">
            Discover the beauty of the underwater world with expert-led diving and snorkeling adventures.
          </p>

          <Link
            to="/trips"
            className="mt-10 inline-block bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300 font-semibold px-10 py-4 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Book Your Adventure
          </Link>
        </motion.div>
      </section>

      {/* Featured Destinations Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center text-cyan-600 mb-12 tracking-tight"
        >
          Featured Destinations
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredDestinations.map((dest, i) => (
            <motion.div
              key={dest.destination}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <Link
                to={`/trips?destination=${encodeURIComponent(dest.destination)}`}
                className="bg-white rounded-3xl shadow-xl overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {dest.imageUrl && (
                  <img
                    src={dest.imageUrl}
                    alt={dest.destination}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-cyan-700 mb-3">{dest.destination}</h3>
                  <p className="text-gray-600">{dest.description}</p>
                  <button className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition-transform hover:scale-105">
                    View Details
                  </button>
                </div>
              </Link>
            </motion.div>
=======
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center px-6 py-16 md:py-28 min-h-screen">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
              Explore the Depths with <br className="hidden md:block" />
              <span className="block md:inline text-cyan-400">
                SEVSEA DIVERS
              </span>
            </h1>

            <p className="mt-6 text-base md:text-lg lg:text-xl text-white drop-shadow-md max-w-2xl">
              Discover the beauty of the underwater world with our expert-led
              diving and snorkeling trips. Whether you're a beginner or an
              experienced diver, we have the perfect adventure for you.
            </p>

            <Link
              to="/trips"
              className="mt-8 inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg transition-all duration-300"
            >
              Book Your Adventure
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2
          className="text-2xl md:text-3xl font-bold mb-8"
          style={{ color: "#06b6d4", textAlign: "center" }}
        >
          Featured Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDestinations.map((dest) => (
            <div
              key={dest.destination}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-shadow duration-300 group hover:shadow-xl hover:-translate-y-1"
              style={{ cursor: "pointer" }}
            >
              {dest.imageUrl && (
                <img
                  src={dest.imageUrl}
                  alt={dest.destination}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-cyan-700 mb-2">
                  {dest.destination}
                </h3>
                <p className="text-gray-600 text-sm flex-1 mb-4">
                  {dest.description}
                </p>
                <a
                  href={`/trips?destination=${encodeURIComponent(
                    dest.destination
                  )}`}
                  className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-lg text-base shadow transition-all duration-200 mt-auto group-hover:scale-105"
                  style={{ textAlign: "center" }}
                >
                  View Details
                </a>
              </div>
            </div>
>>>>>>> feffd9d15a72edcacfb2c9cbd0602dc9db46c9bb:client/src/sections/main/home/view/home-view.tsx
          ))}
        </div>
      </section>
    </>
  )
}
