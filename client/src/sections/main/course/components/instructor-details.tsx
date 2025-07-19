// InstructorSection.jsx
export default function InstructorSection() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Instructor</h2>
      <div className="flex items-start">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        <div className="ml-4">
          <h3 className="font-bold text-lg">Dr. Sarah Johnson</h3>
          <p className="text-cyan-600">Senior Developer & Educator</p>
          <p className="mt-2 text-gray-600">
            With over 10 years of experience in web development and teaching, Sarah brings practical industry knowledge to her courses.
          </p>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-orange-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">4.8 instructor rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}