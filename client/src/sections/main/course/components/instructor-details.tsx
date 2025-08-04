import { useGetCourseQuery } from "../../../../store/course";
import { useParams } from "react-router";
import { motion } from "framer-motion";

export default function InstructorSection() {
  const { id } = useParams();
  const { data: course, isLoading } = useGetCourseQuery(id as string);

  // Animation variants
  const imageVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!course?.instructorImage) return <div className="mt-8 text-gray-500">Instructor data not available.</div>;

  // Function to handle image URL
  const getImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    return url.replace(
      "http://localhost:5000",
      "https://api.sevseadivers.com"
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
      <h2 className="text-2xl font-bold mb-6 text-cyan-700">Instructor</h2>
      <div className="flex items-start gap-6">
        {/* Larger instructor image with hover effect */}
        <motion.div
          className="relative"
          whileHover="hover"
          whileTap="tap"
          initial={{ scale: 1 }}
        >
          <motion.img
            src={getImageUrl(course.instructorImage)}
            alt={course.instructorName}
            className="w-32 h-32 rounded-xl object-cover border-2 border-gray-200 shadow-md"
            variants={imageVariants}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          {/* Optional: Badge for verified instructors */}
          {course.instructorRating >= 4.5 && (
            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              Pro
            </div>
          )}
        </motion.div>

        <div className="flex-1">
          <h3 className="font-bold text-xl">{course.instructorName}</h3>
          <p className="mt-3 text-gray-600 leading-relaxed">{course.instructorBio}</p>

          <div className="mt-4 flex items-center">
            <div className="flex items-center text-orange-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-6 h-6 ${i < Math.round(course.instructorRating || 0) ? 'fill-current' : 'fill-gray-300'}`} 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600 font-medium">
              {course.instructorRating?.toFixed(1) || "N/A"} Rating
            
            </span>
          </div>

         
        </div>
      </div>
    </div>
  );
}