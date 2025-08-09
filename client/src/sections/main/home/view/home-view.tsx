import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Link } from "react-router"
import About from "../../../../assets/about.png"
import Dive from "../../../../assets/dive.png"
import Explore from "../../../../assets/explore.png"
import Premium from "../../../../assets/premium-banner.png"
import Tutorial from "../../../../assets/tutorial.png"
import FAQSection from "../../../../components/FAQSection"
import ImageGallerySection from "../../../../components/ImageGallerySection"
import PricingSection from "../../../../components/PricingSection"
import Testimonial from "../../../../components/Testimonial"
import WorkSection from "../../../../components/WorkSection"
import { useTrips } from "../../../trip/hooks/use-trips"
import { ServiceView } from "../../service/service/view"

export function HomeView() {
  const { allTrips } = useTrips()
  const heroRef = useRef(null) // Create a ref for the hero section
  // Use useScroll and useTransform for the parallax/hide effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"], // Start animation when the top of hero is at the top of viewport, end when the bottom of hero is at the top of viewport
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]) // Move the video slower than scroll
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]) // Fade out the overlay and content

  if (!allTrips) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading trips...
      </div>
    )
  }

  const featuredDestinations = (() => {
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

  return (
    <>
      {/* Hero Section */}
      <section
        aria-label="Hero section"
        className="relative w-full h-screen bg-black text-white overflow-hidden"
        ref={heroRef} // Assign the ref to the hero section
      >
        {/* Video Background with parallax effect */}
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ y }} // Apply the transformed y value for parallax
        >
          <source src="/Hero.MP4" type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black/70 to-cyan-900/60 z-10" // Increased z-index to be above video
          style={{ opacity }} // Apply the transformed opacity value
        />
        {/* Hero Content */}
        <motion.main
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 flex flex-col justify-center items-center text-center px-6 py-16 md:py-28 min-h-screen max-w-4xl mx-auto" // Increased z-index to be above overlay
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
            Explore the Depths with <br />
            <span className="text-cyan-400">SEVSEA DIVERS</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl text-white/90 drop-shadow-md">
            Discover the beauty of the underwater world with expert-led diving
            and snorkeling adventures.
          </p>
          <Link
            to="/trips"
            className="mt-10 inline-block bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300 font-semibold px-10 py-4 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Book Your Adventure
          </Link>
        </motion.main>
      </section>

      {/* About Sevsea Section - New Section */}
      <section aria-label="About Sevsea" className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center text-cyan-600 mb-12 tracking-tight"
          >
            About Sevsea Divers
          </motion.h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            {/* Image Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <img
                src={About || "/placeholder.svg"} // Placeholder image, replace with an actual image for Sevsea
                alt="Sevsea Divers"
                className="w-full h-auto object-cover rounded-2xl"
              />
            </motion.div>
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full md:w-1/2 lg:w-2/3 text-center md:text-left mr-19"
            >
              <h3 className="text-3xl font-bold text-gray-300 mb-4">
                Your Gateway to the Underwater World
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                SEVSEA DIVERS is a Somali-based center offering safe and
                professional scuba diving, snorkeling, and marine tours. We were
                founded to inspire Somalis to explore the beauty of their seas
                while creating new job opportunities and skills for youth. We
                believe the ocean is a national treasure that deserves
                protection and sustainable development through training,
                tourism, and environmental awareness.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section aria-label="Featured destinations" className="py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center text-cyan-600 mb-12 tracking-tight"
        >
          Featured Destinations
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 container mx-auto px-6 lg:px-8">
          {featuredDestinations.map(
            ({ destination, imageUrl, description }, i) => (
              <motion.div
                key={destination}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <Link
                  to={`/trips?destination=${encodeURIComponent(destination)}`}
                  className="block bg-white rounded-3xl shadow-xl overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  aria-label={`View trips to ${destination}`}
                >
                  {imageUrl && (
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`${destination} underwater diving scene`}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-cyan-700 mb-3">
                      {destination}
                    </h3>
                    <p className="text-gray-600">
                      {description
                        ? description.length > 100
                          ? description.slice(0, 100) + "..."
                          : description
                        : "Explore this amazing destination."}
                    </p>
                    <span className="mt-6 inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition-transform hover:scale-105 cursor-pointer">
                      View Details
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          )}
        </div>
      </section>

      <ServiceView />

      {/* 3 Easy Steps Section */}
      <section aria-label="3 Easy Steps" className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center text-gray-300 mb-12 tracking-tight"
          >
            TAKE A PLUNGE INTO THE WORLD BELOW IN JUST 3 EASY STEPS!!!
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-12">
            {/* Step 1: Learn */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center text-center p-6 " // Ensured consistent bg-gray-50
            >
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <img
                  src={Tutorial || "/placeholder.svg"}
                  alt="Learn to Scuba Dive"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500 group-hover:border-cyan-700 transition-colors duration-300"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">
                LEARN
              </h3>
              <p className="text-gray-300 max-w-xs">
                Learn to Scuba Dive! Enroll in a course!
              </p>
            </motion.div>
            {/* Step 2: Dive */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center text-center p-6" // Ensured consistent bg-gray-50
            >
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <img
                  src={Dive || "/placeholder.svg"}
                  alt="Dive with us"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500 group-hover:border-cyan-700 transition-colors duration-300"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">
                DIVE
              </h3>
              <p className="text-gray-300 max-w-xs">
                Dive in with our beginner friendly scuba lessons!
              </p>
            </motion.div>
            {/* Step 3: Explore */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-center text-center p-6" // Ensured consistent bg-gray-50
            >
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <img
                  src={Explore || "/placeholder.svg"}
                  alt="Explore the world"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500 group-hover:border-cyan-700 transition-colors duration-300"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">
                EXPLORE
              </h3>
              <p className="text-gray-300 max-w-xs">
                Learn to Scuba Dive & Explore the other 71% of the Earth!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <WorkSection />

      {/* Testimonials Section */}
      <Testimonial />

      {/* Image Gallery Section */}
      <ImageGallerySection />

      {/* Pricing Section */}
      {/* <PricingSection /> */}

      {/* FAQ Section */}
      <FAQSection />
    </>
  )
}
