import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router"
import type { Course } from "../../../../types/course"
import { cardVariants } from "./animations"

interface CourseCardProps {
  course: Course
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="p-4 bg-white rounded-xl shadow hover:shadow-lg border border-blue-200 flex flex-col gap-3 transition-all duration-300"
    >
      {course.imageUrl && (
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      <h3 className="text-xl font-bold text-cyan-700">{course.title}</h3>

      <p className="text-sm text-gray-700 line-clamp-3">{course.description}</p>

      <div className="text-sm text-gray-800 divide-y divide-gray-200 rounded-md bg-gray-50 p-3 shadow-inner">
        <div className="flex justify-between py-1">
          <span className="text-cyan-700 font-semibold">Duration</span>
          <span className="text-blue-600">{course.duration || "N/A"}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-cyan-700 font-semibold">Price</span>
          <span className="text-blue-600">
            ${course.price !== undefined ? course.price : "Free"}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-cyan-700 font-semibold">Category</span>
          <span className="text-blue-600">{course.category || "—"}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-cyan-700 font-semibold">Level</span>
          <span className="text-blue-600">{course.level || "—"}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-cyan-700 font-semibold">Instructor</span>
          <span className="text-blue-600">{course.instructorName || "—"}</span>
        </div>
      </div>

      <Link to={`/courses/${course.id}`} className="mt-3">
        <button className="w-full bg-[#20C2F8] text-white font-semibold py-2 rounded-md hover:bg-cyan-800 transition">
          View Course Detials
        </button>
      </Link>
    </motion.div>
  )
}
