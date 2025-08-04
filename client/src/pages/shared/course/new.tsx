import { Helmet } from "react-helmet-async"
import { CONFIG } from "../../../global-config"
import { CourseNewCreateForm, type NewCourseSchemaType } from "../../../sections/shared/course/course-new-create-form"
import { CourseCurriculumForm } from "../../../sections/shared/course/course-curriculum-form"
import CourseInstructorDetails, { type InstructorFormData } from "../../../sections/shared/course/course-instructor-detials"
import { useState, useCallback, useMemo } from "react"
import { useCreateCourseMutation } from "../../../store/course"
import { useRouter } from "../../../routes/hooks"
import { paths } from "../../../routes/paths"

// Type definitions
type CurriculumFormData = {
  videoFile?: File | null
  learnPoints: string[]
  includes: { icon: string; text: string }[]
}

type CourseData = {
  details: NewCourseSchemaType
  curriculum: CurriculumFormData
  instructor: InstructorFormData
}

const metadata = {
  title: `Create a new Course | Dashboard - ${CONFIG.appName}`,
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"details" | "curriculum" | "instructor">("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createCourse] = useCreateCourseMutation()
  const router = useRouter()

  // Initialize form state with proper types
  const [courseData, setCourseData] = useState<CourseData>({
    details: {
      title: "",
      description: "",
      category: "",
      level: "",
      imageUrl: null,
      price: undefined,
      discountedPrice: undefined,
      duration: "",
      minAge: undefined,
      prerequisites: [],
    },
    curriculum: {
      videoFile: null,
      learnPoints: [""],
      includes: [],
    },
    instructor: {
      staffId: "",
      instructorName: undefined,
      instructorBio: undefined,
      instructorRating: undefined,
    },
  })

  // Update handlers
  const updateDetails = useCallback((data: NewCourseSchemaType) => {
    setCourseData(prev => ({ ...prev, details: data }))
  }, [])

  const updateCurriculum = useCallback((data: CurriculumFormData) => {
    setCourseData(prev => ({ ...prev, curriculum: data }))
  }, [])

  const updateInstructor = useCallback((data: InstructorFormData) => {
    setCourseData(prev => ({ ...prev, instructor: data }))
  }, [])

  // Helper: missing required fields per tab
  const getMissingFields = (tab: "details" | "curriculum" | "instructor"): string[] => {
    if (tab === "details") {
      const missing: string[] = []
      if (!courseData.details.title.trim()) missing.push("title")
      if (!courseData.details.description.trim()) missing.push("description")
      if (!courseData.details.category) missing.push("category")
      if (!courseData.details.level) missing.push("level")
      if (!courseData.details.imageUrl) missing.push("image")
      return missing
    }
    if (tab === "curriculum") {
      const missing: string[] = []
      if (!courseData.curriculum.learnPoints.some(p => p.trim())) missing.push("learning points")
      return missing
    }
    if (tab === "instructor") {
      const missing: string[] = []
      if (!courseData.instructor.staffId) missing.push("staff selection")
      return missing
    }
    return []
  }

  // Derived completeness
  const isTabComplete = (tab: "details" | "curriculum" | "instructor") => {
    return getMissingFields(tab).length === 0
  }

  const allMissing = useMemo(() => {
    return {
      details: getMissingFields("details"),
      curriculum: getMissingFields("curriculum"),
      instructor: getMissingFields("instructor"),
    }
  }, [courseData])

  // Navigation helpers
  const canProceedToNext = () => {
    if (activeTab === "details") return isTabComplete("details")
    if (activeTab === "curriculum") return isTabComplete("curriculum")
    return true
  }

  const getNextTab = () => {
    if (activeTab === "details") return "curriculum"
    if (activeTab === "curriculum") return "instructor"
    return "instructor"
  }

  const getPreviousTab = () => {
    if (activeTab === "curriculum") return "details"
    if (activeTab === "instructor") return "curriculum"
    return "details"
  }

// Form submission handler 

const handleSubmitAll = async () => {
  try {
    setIsSubmitting(true)

    // Debug: Check authentication
    const token = localStorage.getItem("auth_token");
    console.log("🔑 Token exists:", !!token);
    console.log("🔑 Token preview:", token ? token.substring(0, 50) + "..." : "No token");
    
    // Debug: Check if token is expired (if it's a JWT)
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        console.log("🔑 Token expired:", isExpired);
        console.log("🔑 Token expires at:", new Date(payload.exp * 1000));
      } catch (e) {
        console.log("🔑 Token is not a valid JWT or couldn't decode");
      }
    }

    // Log for debugging
    console.log("Submitting courseData:", courseData)

    const missingDetails = getMissingFields("details")
    if (missingDetails.length > 0) {
      setActiveTab("details")
      alert(`Please complete: ${missingDetails.join(", ")}`)
      return
    }

    const missingCurriculum = getMissingFields("curriculum")
    if (missingCurriculum.length > 0) {
      setActiveTab("curriculum")
      alert(`Please complete: ${missingCurriculum.join(", ")}`)
      return
    }

    const missingInstructor = getMissingFields("instructor")
    if (missingInstructor.length > 0) {
      setActiveTab("instructor")
      alert(`Please complete: ${missingInstructor.join(", ")}`)
      return
    }

    // Build FormData
    const formData = new FormData()

    // 1. Append course details
    formData.append("title", courseData.details.title)
    formData.append("description", courseData.details.description)
    formData.append("category", courseData.details.category)
    formData.append("level", courseData.details.level)

    if (courseData.details.price !== undefined) {
      formData.append("price", courseData.details.price.toString())
    }
    if (courseData.details.discountedPrice !== undefined) {
      formData.append("discountedPrice", courseData.details.discountedPrice.toString())
    }
    if (courseData.details.duration) {
      formData.append("duration", courseData.details.duration)
    }
    if (courseData.details.minAge !== undefined) {
      formData.append("minAge", courseData.details.minAge.toString())
    }

    courseData.details.prerequisites
      .filter(p => p.trim())
      .forEach((item, index) => {
        formData.append(`prerequisites[${index}]`, item)
      })

    // 2. Append files
    if (courseData.details.imageUrl instanceof File) {
      formData.append("courseImage", courseData.details.imageUrl)
    }
    if (courseData.curriculum.videoFile instanceof File) {
      formData.append("curriculumVideo", courseData.curriculum.videoFile)
    }

    // 3. Curriculum learn points
    courseData.curriculum.learnPoints
      .filter(point => point.trim())
      .forEach((point, index) => {
        formData.append(`learnPoints[${index}]`, point)
      })

    // 4. Instructor data - send both staffId and instructorRating
formData.append("staffUserId", courseData.instructor.staffId);

    
    // Add the instructor rating that the user set in the form
    if (courseData.instructor.instructorRating !== undefined) {
      formData.append("instructorRating", courseData.instructor.instructorRating.toString())
    }

    console.log("🚀 About to submit FormData");
    
    // Debug: Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`📤 FormData: ${key} =`, value);
    }

    await createCourse(formData).unwrap()
    router.push(paths.shared.course.list)
  } catch (error: any) {
    console.error("❌ Error submitting course:", error)
    
    // Enhanced error logging
    if (error.status === 403) {
      console.error("🚫 403 Forbidden - Check authentication and permissions");
      console.error("🚫 Full error object:", error);
      
      // Check if user has proper role
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.error("🚫 User role from token:", payload.role);
          console.error("🚫 User ID from token:", payload.id || payload.userId);
        } catch (e) {
          console.error("🚫 Could not decode token payload");
        }
      }
    }
    
    alert(error?.data?.message || error?.message || "Failed to create course")
  } finally {
    setIsSubmitting(false)
  }
}
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Create New Course</h1>
          <p className="text-gray-600 mt-1">Fill in all sections to create your course</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-6">
              {[
                { key: "details", label: "Course Details", number: 1 },
                { key: "curriculum", label: "Curriculum", number: 2 },
                { key: "instructor", label: "Instructor", number: 3 },
              ].map(tab => (
                <div key={tab.key} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isTabComplete(tab.key as any)
                          ? "bg-green-500 text-white shadow-lg"
                          : activeTab === tab.key
                          ? "bg-cyan-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isTabComplete(tab.key as any) ? "✓" : tab.number}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-semibold text-gray-700">Step {tab.number}</div>
                      <div className="text-xs text-gray-500">{tab.label}</div>
                      {allMissing[tab.key as keyof typeof allMissing].length > 0 && (
                        <div className="text-[10px] text-red-600 mt-0.5">
                          Missing: {allMissing[tab.key as keyof typeof allMissing].join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Step {activeTab === "details" ? "1" : activeTab === "curriculum" ? "2" : "3"} of 3
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8 mb-6">
          {activeTab === "details" && (
            <CourseNewCreateForm key="details" initialData={courseData.details} onUpdate={updateDetails} />
          )}
          {activeTab === "curriculum" && (
            <CourseCurriculumForm
              key="curriculum"
              initialData={courseData.curriculum}
              onUpdate={updateCurriculum}
            />
          )}
          {activeTab === "instructor" && (
            <CourseInstructorDetails
              key="instructor"
              initialData={courseData.instructor}
              onUpdate={updateInstructor}
            />
          )}
        </div>

        {/* Aggregate error banner if final tab has missing */}
        {activeTab === "instructor" && allMissing.instructor.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded flex gap-3">
            <div className="flex-shrink-0 text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-sm text-red-700">
              Please complete instructor section: {allMissing.instructor.join(", ")}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setActiveTab(getPreviousTab())}
            disabled={activeTab === "details"}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "details"
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            ← Previous Step
          </button>

          <div className="flex gap-3">
            {activeTab !== "instructor" ? (
              <button
                onClick={() => {
                  const missing = getMissingFields(activeTab)
                  if (missing.length) {
                    alert(
                      `Please complete the following in the ${activeTab} section: ${missing.join(
                        ", "
                      )}`
                    )
                    return
                  }
                  setActiveTab(getNextTab())
                }}
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700"
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={handleSubmitAll}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg font-medium min-w-[140px] ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isSubmitting ? "Creating..." : "Submit All"}
              </button>
            )}
          </div>
        </div>

        {/* Summary of all missing if trying to submit prematurely */}
        {activeTab === "instructor" &&
          (allMissing.details.length || allMissing.curriculum.length || allMissing.instructor.length) > 0 && (
            <div className="mt-4 text-xs text-gray-600">
              <div>Details missing: {allMissing.details.join(", ") || "none"}</div>
              <div>Curriculum missing: {allMissing.curriculum.join(", ") || "none"}</div>
              <div>Instructor missing: {allMissing.instructor.join(", ") || "none"}</div>
            </div>
          )}
      </div>
    </>
  )
}