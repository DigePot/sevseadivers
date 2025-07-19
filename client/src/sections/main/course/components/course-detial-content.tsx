
export default function CourseContentSection() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Content</h2>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-600 font-medium">{i + 1}</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Module {i + 1}: Key Concepts</h3>
                <p className="text-gray-600 text-sm mt-1">3 lessons • 45 minutes</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        ))}
      </div>
      
      <button className="mt-8 w-full py-3 text-center border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
        Show all 12 modules
      </button>
    </div>
  );
}