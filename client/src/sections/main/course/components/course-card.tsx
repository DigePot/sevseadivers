import React from "react"
import type { Course } from "../../../../types/course"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { cardVariants } from "./animations"

interface CourseCardProps {
  course: Course
  bundle?: boolean
  index?: number
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  bundle = false,
  index = 0,
}) => {
  // Improved discount logic that properly handles null/undefined/0 values
  const hasValidDiscount =
    course.discountedPrice !== null &&
    course.discountedPrice !== undefined &&
    course.discountedPrice > 0 &&
    course.price &&
    course.discountedPrice < course.price

  const discountPercentage = hasValidDiscount
    ? Math.round(
        100 - ((course.discountedPrice as number) / course.price) * 100
      )
    : 0

  const showDiscount = hasValidDiscount && discountPercentage >= 1

  const imageHoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      className="max-w-sm bg-white border border-cyan-500 rounded-lg shadow-md overflow-hidden 
           hover:border-blue-500 hover:shadow-lg transition duration-300 ease-in-out"
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
    >
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Bundle or Certificate Header */}
        {bundle ? (
          <motion.div
            className="absolute top-0 left-0 bg-blue-600 text-white p-2 text-center text-sm font-bold z-10 rounded-br-lg"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            
            BUNDLE PACK
          </motion.div>
        ) : course.certificate ? (
          <motion.div
            className="absolute top-0 left-0 bg-gray-800 text-white p-2 text-center text-sm font-bold z-10 rounded-br-lg"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            CERTIFICATE
          </motion.div>
        ) : null}

        {/* Flash Sale Banner - Only shows when there's a valid discount */}
        {showDiscount && (
          <motion.div
            className="bg-gradient-to-r from-red-600 to-red-500 text-white p-2 text-center text-xs font-medium"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Flash Sale: Save {discountPercentage}% today only!
          </motion.div>
        )}

        {/* Course Image */}
        <motion.div className="h-48 overflow-hidden" variants={cardVariants}>
          <img
            // src={course.imageUrl || course.posterUrl || "/images/default-course.png"}
           src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {course.level && (
            <motion.span
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
              whileHover={{ scale: 1.05 }}
            >
              {course.level}
            </motion.span>
          )}
          {course.category && (
            <motion.span
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium"
              whileHover={{ scale: 1.05 }}
            >
              {course.category}
            </motion.span>
          )}
        </div>

        {/* Course Title */}
        <motion.h3
          className="text-xl font-bold text-cyan-700 mb-2 line-clamp-2"
          whileHover={{ color: "#0369a1" }}
        >
          {course.title}
        </motion.h3>

        {/* Course Description */}
        <motion.p
          className="text-gray-600 mb-4 line-clamp-3"
          whileHover={{ color: "#4b5563" }}
        >
          {course.description}
        </motion.p>

        {/* Duration and Instructor */}
        <div className="flex flex-col gap-1 text-sm text-gray-500 mb-4">
          {course.duration && (
            <motion.div className="flex items-center" whileHover={{ x: 3 }}>
              <svg
                className="w-4 h-4 mr-1 text-cyan-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Duration: {course.duration}</span>
            </motion.div>
          )}

          {course.instructorName && (
            <motion.div className="flex items-center" whileHover={{ x: 3 }}>
              <svg
                className="w-4 h-4 mr-1 text-cyan-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>By {course.instructorName}</span>
            </motion.div>
          )}
        </div>

        {/* Prerequisites - Only show if prerequisites exist */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="flex items-start">
            <svg
              className="w-4 h-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <span className="text-orange-700 font-medium">
                Prerequisites:
              </span>
              <div className="ml-1 text-gray-600">
                {course.prerequisites.slice(0, 2).join(", ")}
                {course.prerequisites.length > 2 && "..."}
              </div>
            </div>
          </div>
        )}

        {/* Age Limit - Only show if minAge exists and is greater than 0 */}
        {(course.minAge ?? 0) > 0 && (
          <div className="flex items-start mt-1">
            <svg
              className="w-4 h-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <span className="text-orange-700 font-medium">Age Limit:</span>
              <span className="ml-1 text-gray-600">{course.minAge} years</span>
            </div>
          </div>
        )}

        {/* Pricing Section */}
        <div className="mb-4 space-y-1">
          {showDiscount ? (
            <>
              <motion.p
                className="text-gray-500 text-sm"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                }}
              >
                Regular Price:{" "}
                <span className="line-through">
                  ${course.price?.toFixed(2)}
                </span>{" "}
                USD
              </motion.p>
              <motion.p
                className="text-green-600 text-sm font-medium"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                Today's Discount: {discountPercentage}% off
              </motion.p>
              <motion.p
                className="text-blue-600 font-bold text-base"
                whileHover={{ scale: 1.02 }}
              >
                Price: ${course.discountedPrice?.toFixed(2)} USD
              </motion.p>
            </>
          ) : (
            <motion.p
              className="text-blue-600 font-bold text-base"
              whileHover={{ scale: 1.02 }}
            >
              Price: ${course.price?.toFixed(2)} USD
            </motion.p>
          )}
        </div>

        {/* CTA Button */}
        <Link to={`/courses/${course.id}`} className="mt-3 block">
          <motion.button
            className="w-full bg-white border-2 border-blue-600 text-blue-600 font-bold py-2 px-4 rounded-md flex items-center justify-center"
            whileHover={{
              backgroundColor: "#2563eb",
              color: "#fff",
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>VIEW ALL DETAILS</span>
            <motion.svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                x: [0, 4, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </motion.svg>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

export default CourseCard
