// HighlightsSidebar.jsx
export default function HighlightsSidebar() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">What You'll Learn</h2>
      <ul className="space-y-3">
        {[
          "Fundamental swimming strokes and techniques",
          "Breathing control and water safety skills",
          "Snorkeling best practices and gear usage",
          "Diving basics and underwater navigation",
          "Environmental awareness and marine life interaction",
        ].map((item, i) => (
          <li key={i} className="flex items-start">
            <svg className="w-5 h-5 text-cyan-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-3">This course includes:</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🎥", text: "6 hours underwater video guides" },
            { icon: "📖", text: "10 expert-written articles" },
            { icon: "🧰", text: "Snorkel & dive safety checklist" },
            { icon: "🏅", text: "Certificate of completion" },
            { icon: "📲", text: "Mobile-friendly lessons" },
            { icon: "♻️", text: "Lifetime access to updates" },
          ].map((item, i) => (
            <div key={i} className="flex items-center">
              <span className="text-lg mr-2">{item.icon}</span>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
