// InstructorSection.jsx

import { useGetCourseQuery } from "../../../../store/course";
import { useParams } from "react-router";
export default function InstructorSection() {
  const { id } = useParams();
  const { data: course, isLoading } = useGetCourseQuery(id as string);

  if (isLoading) return <div>Loading...</div>;

  if (!course?.instructorImage) return <div className="mt-8 text-gray-500">Instructor data not available.</div>;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
      <h2 className="text-2xl font-bold mb-6 text-cyan-700">Instructor</h2>
      <div className="flex items-start">
        {/* Instructor image */}
        <img
          src={course.instructorImage || "/default-avatar.png"}
          alt={course.instructorName}
          className="w-16 h-16 rounded-xl object-cover border border-gray-300"
        />

        <div className="ml-4">
          <h3 className="font-bold text-lg">{course.instructorName}</h3>
          <p className="mt-2 text-gray-600">{course.instructorBio}</p>

          <div className="mt-4 flex items-center">
            <div className="flex items-center text-orange-400">
              {[...Array(Math.round(course.instructorRating || 0))].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {course.instructorRating?.toFixed(1) || "N/A"} instructor rating
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
