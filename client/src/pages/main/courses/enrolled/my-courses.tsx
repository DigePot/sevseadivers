import React, { useState } from "react";
import { useGetUserEnrollmentsQuery } from "../../../../store/enrollment";
import type { Enrollment } from "../../../../types/enrollment";
import { useNavigate } from "react-router-dom";

const sidebarLinks = [
  { label: "My Courses", path: "/mycourses", active: true },
  { label: "Home", path: "/", active: false },
  { label: "Explore Courses", path: "/courses", active: false },
  { label: "Profile", path: "/profile", active: false },
];

const MyCoursesPage = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data, isLoading, error } = useGetUserEnrollmentsQuery();
  const enrollments: Enrollment[] = Array.isArray(data)
    ? data
    : (data && Array.isArray((data as any).data)
        ? (data as any).data
        : []);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Collapsible Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col py-8 px-4 transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          {isExpanded && (
            <h2 className="text-2xl font-bold text-cyan-700">Dashboard</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 text-cyan-700 transform transition-transform ${
                isExpanded ? "" : "rotate-180"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isExpanded ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          </button>
        </div>
        
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex items-center text-left px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                link.active 
                  ? 'bg-cyan-100 text-cyan-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              disabled={link.active}
              title={link.label}
            >
              {/* Add icons for better visual when collapsed */}
              <span className={`${isExpanded ? "mr-3" : ""}`}>
                {link.label === "My Courses" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                )}
                {link.label === "Home" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                )}
                {link.label === "Explore Courses" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                )}
                {link.label === "Profile" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {isExpanded && link.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
        isExpanded ? "ml-0" : "ml-0"
      }`}>
        <div className="flex items-center mb-6">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-gray-200 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-cyan-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-cyan-800">My Enrolled Courses</h1>
        </div>
        
        {isLoading && <div>Loading...</div>}
        {error && <div>Error loading enrollments.</div>}
        {!isLoading && !error && enrollments.length === 0 && (
          <div className="text-gray-500">You have not enrolled in any courses yet.</div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment: Enrollment) => (
            <div key={enrollment.id} className="bg-white rounded-xl shadow p-5 flex flex-col">
              {enrollment.Course?.imageUrl && (
                <img
                  src={enrollment.Course.imageUrl}
                  alt={enrollment.Course.title}
                  className="w-full h-40 object-cover rounded-lg mb-4 border"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{enrollment.Course?.title || "Course"}</h2>
              <p className="text-gray-600 mb-2">{enrollment.Course?.description?.slice(0, 100)}...</p>
              <div className="text-cyan-700 font-bold mb-1">Price: ${enrollment.amount}</div>
              <div className="text-sm text-gray-500 mb-1">Status: {enrollment.status}</div>
              <div className="text-xs text-gray-400">Enrolled on: {enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString() : "-"}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyCoursesPage;