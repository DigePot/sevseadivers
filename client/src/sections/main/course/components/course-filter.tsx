import React from "react"

interface CourseFilterProps {
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  search: string
  setSearch: (value: string) => void
  categories: string[]
}

export const CourseFilter: React.FC<CourseFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  categories,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 mt-10">
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-3 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
            className={`px-4 py-2 rounded-full border font-medium whitespace-nowrap transition ${
              selectedCategory === category
                ? "bg-cyan-600 text-white"
                : "bg-white border-cyan-600 text-cyan-600 hover:bg-cyan-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="flex items-center">
        <label htmlFor="course-search" className="sr-only">
          Search courses
        </label>
        <input
          id="course-search"
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md border text-white border-cyan-600 w-full md:w-64"
        />
      </div>
    </div>
  )
}
