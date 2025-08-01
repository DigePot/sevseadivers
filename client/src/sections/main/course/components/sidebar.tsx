import { useParams } from "react-router";
import { useGetCourseQuery } from "../../../../store/course";

export default function HighlightsSidebar() {
  const { id } = useParams(); // ✅ Get course ID from route
  const { data: course, isLoading } = useGetCourseQuery(id as string); // 👈 Ensure it's treated as string

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
      <h2 className="text-xl font-bold mb-4 text-cyan-700">What You'll Learn</h2>
      <ul className="space-y-3">
        {course?.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? (
          course.whatYouWillLearn.map((item, i) => (
            <li key={i} className="flex items-start">
              <svg
                className="w-5 h-5 text-cyan-600 mt-0.5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No highlights available.</p>
        )}
      </ul>

      {/* Minimum Age Section */}
      {course?.minAge && (
        <div className="mt-6">
          <h3 className="font-semibold text-cyan-700 mb-2">Minimum Age Requirement:</h3>
          <p className="text-sm">{course.minAge} years old</p>
        </div>
      )}

      {/* Prerequisites Section */}
      {course?.prerequisites && course.prerequisites.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-cyan-700 mb-2">Prerequisites:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {course.prerequisites.map((prereq, i) => (
              <li key={i} className="text-sm">{prereq}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold text-cyan-700 mb-3">This course includes:</h3>
        <div className="grid grid-cols-2 gap-3">
          {course?.includes && course.includes.length > 0 ? (
            course.includes.map((item, i) => (
              <div key={i} className="flex items-center">
                <span className="text-lg mr-2">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No course includes listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}