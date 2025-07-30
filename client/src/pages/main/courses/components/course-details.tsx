import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useGetCourseQuery } from "../../../../store/course"
import { AuthGuard } from "../../../../sections/auth/guard/auth-guard"
import CourseContentSection from "../../../../sections/main/course/components/course-detial-content"
import InstructorSection from "../../../../sections/main/course/components/instructor-details"
import HighlightsSidebar from "../../../../sections/main/course/components/sidebar"

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: course, isLoading } = useGetCourseQuery(id as string)
  const [imgSrc, setImgSrc] = useState("")

  useEffect(() => {
    if (course?.imageUrl) {
      setImgSrc(course.imageUrl)
    }
  }, [course])

  const handleImageError = () => {
    setImgSrc("/images/course-placeholder.jpg")
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-600"></div>
      </div>
    )

  if (!course)
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-20">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold">Course Not Found</h2>
          <p className="mt-2">
            The requested course doesn't exist or has been removed
          </p>
        </div>
        <button
          onClick={() => navigate("/courses")}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Browse All Courses
        </button>
      </div>
    )

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 md:p-10 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/5">
              <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={imgSrc}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            </div>

            <div className="md:w-3/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
                    {course.category || "Development"}
                  </span>
                  <span className="text-gray-500">•</span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < (course.rating || 4)
                            ? "fill-current"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600">
                      ({course.reviews || 124})
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-cyan-700 mb-4">
                  {course.title}
                </h1>
                <p className="text-gray-600 text-lg">{course.description}</p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>{course.duration || "8 hours"}</span>
                  </div>
                  
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {course.price} $
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/courses/${id}/checkout`)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  Enroll Now
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Course Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CourseContentSection />
            <InstructorSection />
          </div>

          <div>
            <HighlightsSidebar />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
