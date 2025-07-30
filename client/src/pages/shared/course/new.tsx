import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../../global-config";
import { CourseNewCreateForm } from "../../../sections/shared/course/course-new-create-form";
import { CourseCurriculumForm } from "../../../sections/shared/course/course-curriculum-form";
import CourseInstructorDetails from "../../../sections/shared/course/course-instructor-detials";
import { useState, useCallback } from "react";
import { useCreateCourseMutation } from "../../../store/course";
import { useRouter } from "../../../routes/hooks";
import { paths } from "../../../routes/paths";

// Define proper types based on the schemas from your forms
type DetailsFormData = {
  title: string;
  description: string;
  price?: number;
  duration?: string;
  category: string;
  level: string;
  imageUrl: File | null;
};

type CurriculumFormData = {
  videoFile: File | null;
  learnPoints: string[];
  includes: { icon: string; text: string }[];
};

type InstructorFormData = {
  instructorName: string;
  instructorBio: string;
  instructorRating: number;
  instructorImage: File | null;
};

type CourseData = {
  details: DetailsFormData;
  curriculum: CurriculumFormData;
  instructor: InstructorFormData;
};

const metadata = {
  title: `Create a new Course | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  const [activeTab, setActiveTab] = useState("details");
  const [courseData, setCourseData] = useState<CourseData>({
    details: {
      title: "",
      description: "",
      price: undefined,
      duration: "",
      category: "",
      level: "",
      imageUrl: null,
    },
    curriculum: {
      videoFile: null,
      learnPoints: [""],
      includes: [],
    },
    instructor: {
      instructorName: "",
      instructorBio: "",
      instructorRating: 4.5,
      instructorImage: null,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createCourse] = useCreateCourseMutation();
  const router = useRouter();

  const handleSubmitAll = async () => {
    try {
      setIsSubmitting(true);

      // Validate that we have all required data
      if (!courseData.details.title.trim()) {
        alert("Please enter a course title");
        setActiveTab("details");
        return;
      }

      if (!courseData.details.description.trim()) {
        alert("Please enter a course description");
        setActiveTab("details");
        return;
      }

      if (!courseData.details.category) {
        alert("Please select a category");
        setActiveTab("details");
        return;
      }

      if (!courseData.details.level) {
        alert("Please select a level");
        setActiveTab("details");
        return;
      }

      if (!courseData.details.imageUrl) {
        alert("Please upload a course image");
        setActiveTab("details");
        return;
      }
      
      if (!courseData.curriculum.videoFile) {
        alert("Please upload a curriculum video");
        setActiveTab("curriculum");
        return;
      }

      if (!courseData.curriculum.learnPoints.some(point => point.trim())) {
        alert("Please add at least one learning point");
        setActiveTab("curriculum");
        return;
      }

      if (!courseData.instructor.instructorName.trim()) {
        alert("Please enter instructor name");
        setActiveTab("instructor");
        return;
      }

      if (!courseData.instructor.instructorBio.trim()) {
        alert("Please enter instructor bio");
        setActiveTab("instructor");
        return;
      }
      
      if (!courseData.instructor.instructorImage) {
        alert("Please upload an instructor image");
        setActiveTab("instructor");
        return;
      }

      // Build FormData
      const formData = new FormData();
      
      // Details
      formData.append("title", courseData.details.title);
      formData.append("description", courseData.details.description);
      formData.append("category", courseData.details.category);
      formData.append("level", courseData.details.level);
      
      if (courseData.details.price !== undefined && courseData.details.price > 0) {
        formData.append("price", courseData.details.price.toString());
      }
      
      if (courseData.details.duration?.trim()) {
        formData.append("duration", courseData.details.duration);
      }
      
      if (courseData.details.imageUrl) {
        formData.append("courseImage", courseData.details.imageUrl);
      }
      
      // Curriculum
      if (courseData.curriculum.videoFile) {
        formData.append("curriculumVideo", courseData.curriculum.videoFile);
      }
      const validLearnPoints = courseData.curriculum.learnPoints.filter(point => point.trim());
      validLearnPoints.forEach((point, index) => {
        formData.append(`learnPoints[${index}]`, point);
      });
      // Includes
      (courseData.curriculum.includes ?? []).forEach((inc, idx) => {
        formData.append(`includes[${idx}][icon]`, inc.icon);
        formData.append(`includes[${idx}][text]`, inc.text);
      });
      // Instructor
      formData.append("instructorName", courseData.instructor.instructorName);
      formData.append("instructorBio", courseData.instructor.instructorBio);
      formData.append("instructorRating", courseData.instructor.instructorRating.toString());
      if (courseData.instructor.instructorImage) {
        formData.append("instructorImage", courseData.instructor.instructorImage);
      }
      
      // API call
      const response = await createCourse(formData).unwrap();
      
      // Course created successfully
      alert("Course created successfully!");
      router.push(paths.shared.course.list);
      
    } catch (error: any) {
      console.error("Error submitting course:", error);
      
      // Better error handling
      if (error.data?.message) {
        alert(`Failed to create course: ${error.data.message}`);
      } else if (error.message) {
        alert(`Failed to create course: ${error.message}`);
      } else {
        alert("Failed to create course. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDetails = useCallback((data: DetailsFormData) => {
    setCourseData(prev => ({ ...prev, details: data }));
  }, []);

  const updateCurriculum = useCallback((data: CurriculumFormData) => {
    setCourseData(prev => ({ ...prev, curriculum: data }));
  }, []);

  const updateInstructor = useCallback((data: InstructorFormData) => {
    setCourseData(prev => ({ ...prev, instructor: data }));
  }, []);

  // Helper function to check if a tab is complete
  const isTabComplete = (tab: string) => {
    switch (tab) {
      case "details":
        return !!(
          courseData.details.title.trim() &&
          courseData.details.description.trim() &&
          courseData.details.category &&
          courseData.details.level &&
          courseData.details.imageUrl
        );
      case "curriculum":
        return !!(
          courseData.curriculum.videoFile &&
          courseData.curriculum.learnPoints.some(point => point.trim())
        );
      case "instructor":
        return !!(
          courseData.instructor.instructorName.trim() &&
          courseData.instructor.instructorBio.trim() &&
          courseData.instructor.instructorImage
        );
      default:
        return false;
    }
  };

  // Check if we can proceed to next step
  const canProceedToNext = () => {
    if (activeTab === "details") return isTabComplete("details");
    if (activeTab === "curriculum") return isTabComplete("curriculum");
    return true;
  };

  // Get next tab
  const getNextTab = () => {
    if (activeTab === "details") return "curriculum";
    if (activeTab === "curriculum") return "instructor";
    return "instructor";
  };

  // Get previous tab
  const getPreviousTab = () => {
    if (activeTab === "curriculum") return "details";
    if (activeTab === "instructor") return "curriculum";
    return "details";
  };

  // Remove useMemo for initialData
  // const detailsInitialData = useMemo(() => courseData.details, []);
  // const curriculumInitialData = useMemo(() => courseData.curriculum, []);
  // const instructorInitialData = useMemo(() => courseData.instructor, []);

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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-6">
              {[
                { key: "details", label: "Course Details", number: 1 },
                { key: "curriculum", label: "Curriculum", number: 2 },
                { key: "instructor", label: "Instructor", number: 3 }
              ].map((tab, index) => (
                <div key={tab.key} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isTabComplete(tab.key)
                          ? "bg-green-500 text-white shadow-lg"
                          : activeTab === tab.key
                          ? "bg-cyan-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isTabComplete(tab.key) ? "✓" : tab.number}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-semibold text-gray-700">
                        Step {tab.number}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tab.label}
                      </div>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className={`hidden sm:block w-16 h-0.5 ml-4 ${
                      isTabComplete(tab.key) ? "bg-green-300" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Step {activeTab === "details" ? "1" : activeTab === "curriculum" ? "2" : "3"} of 3
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {[
            { key: "details", label: "Course Details" },
            { key: "curriculum", label: "Curriculum" },
            { key: "instructor", label: "Instructor Details" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === tab.key
                  ? "border-cyan-600 text-cyan-700 font-semibold bg-cyan-50"
                  : "border-transparent text-gray-600 hover:text-cyan-600 hover:border-cyan-300"
              }`}
            >
              <span>{tab.label}</span>
              {isTabComplete(tab.key) && (
                <span className="text-green-500 text-xs">✓</span>
              )}
              {activeTab === tab.key && (
                <span className="text-cyan-600 text-xs">●</span>
              )}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8 mb-6">
          {activeTab === "details" && (
            <CourseNewCreateForm 
              key="details"
              initialData={courseData.details} 
              onUpdate={updateDetails} 
            />
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

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setActiveTab(getPreviousTab())}
            disabled={activeTab === "details"}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "details"
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600 shadow-lg hover:shadow-xl"
            }`}
          >
            ← Previous Step
          </button>

          <div className="flex gap-3">
            {activeTab !== "instructor" && (
              <button
                onClick={() => {
                  if (canProceedToNext()) {
                    setActiveTab(getNextTab());
                  } else {
                    alert(`Please complete all required fields in the ${activeTab} section before proceeding.`);
                  }
                }}
                disabled={!canProceedToNext()}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  !canProceedToNext()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg hover:shadow-xl"
                }`}
              >
                Next Step →
              </button>
            )}
            
            {activeTab === "instructor" && (
              <button
                onClick={handleSubmitAll}
                disabled={isSubmitting || !isTabComplete("details") || !isTabComplete("curriculum") || !isTabComplete("instructor")}
                className={`px-6 py-3 rounded-lg font-medium transition-all min-w-[140px] ${
                  isSubmitting || !isTabComplete("details") || !isTabComplete("curriculum") || !isTabComplete("instructor")
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? "Creating..." : "Submit All"}
              </button>
            )}
          </div>
        </div>

        {/* Form completion status */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Completion Status:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {[
              { key: "details", label: "Course Details" },
              { key: "curriculum", label: "Curriculum" },
              { key: "instructor", label: "Instructor" }
            ].map((tab) => (
              <div key={tab.key} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isTabComplete(tab.key) ? "bg-green-500" : "bg-gray-300"
                }`} />
                <span className={`${
                  isTabComplete(tab.key) ? "text-green-700" : "text-gray-500"
                }`}>
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
          
          {/* Guidance message */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <div className="text-blue-500 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                {activeTab === "details" && (
                  <span>Complete the course details to proceed to the next step.</span>
                )}
                {activeTab === "curriculum" && (
                  <span>Add your course curriculum and learning objectives.</span>
                )}
                {activeTab === "instructor" && (
                  <span>Fill in instructor information and submit your course when ready.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}