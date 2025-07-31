"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion" // Import Variants
import { ChevronLeft, ChevronRight, X } from "lucide-react"

// Import your image assets
import Gallery1 from "../assets/gallery1.png"
import Gallery2 from "../assets/gallery2.png"
import Gallery3 from "../assets/gallery3.png"
import Gallery4 from "../assets/gallery4.png"
import Gallery5 from "../assets/gallery5.png"
import Gallery6 from "../assets/gallery6.png"
import { useTranslation } from "react-i18next"

const images = [
  { src: Gallery1, alt: "Diver with flashlight in underwater cave" },
  { src: Gallery2, alt: "Fish near coral on seabed" },
  { src: Gallery3, alt: "Cooler filled with fish on ice" },
  { src: Gallery4, alt: "Small blue fish swimming underwater" },
  { src: Gallery5, alt: "Yellow butterflyfish swimming underwater" },
  { src: Gallery6, alt: "Person on boat holding a fish" },
]

const ImageGallerySection = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openModal = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const showNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const showPrevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    )
  }

  const containerVariants: Variants = {
    // Explicitly type containerVariants
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation for each card
      },
    },
  }

  const itemVariants: Variants = {
    // Explicitly type itemVariants
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="image-gallery" className="py-20 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center text-cyan-600 mb-12 tracking-tight"
        >
          {t("gallery.title")}
        </motion.h2>
        <p className="text-lg text-gray-300 text-center mb-16 max-w-2xl mx-auto">
          {t("gallery.text")}
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group"
              variants={itemVariants}
              onClick={() => openModal(index)}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-70 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-2xl font-bold text-center text-cyan-600 mb-12 tracking-tight">
                  View Image
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Full-screen Image Gallery Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-4xl z-50 p-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-75 transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-lg font-semibold z-50 bg-gray-800 bg-opacity-50 px-4 py-2 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={showPrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl z-50 p-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-75 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={showNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl z-50 p-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-75 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Current Image */}
            <img
              src={images[currentIndex].src || "/placeholder.svg"}
              alt={images[currentIndex].alt}
              className="w-full h-full object-contain rounded-lg shadow-xl" // Changed from max-w/h-full to w/h-full
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default ImageGallerySection
