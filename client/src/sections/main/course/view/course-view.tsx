import { useState } from "react"
import { CourseCard } from "../components/course-card"
import { useCourses } from "../../../main/course/hook/use-course"
import { CoursesHeader } from "../components/course-header"
import { CourseFilter } from "../components/course-filter"
import Spinner from "../../../../components/Spinner"
import { WhyLearnUs } from "../components/why-learn"

export const CourseView = () => {
  const { courses, loading, error } = useCourses()
  console.log("Fetched courses:", courses)

  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [search, setSearch] = useState<string>("")

  // Define your static categories
  const categories = ["All", "Diving", "Snorkeling", "Swimming " , "water safety"]

  // Filtering logic
  const filteredCourses = courses.filter((course) => {
    const categoryMatch =
      selectedCategory === "All" ||
      course.category?.toLowerCase() === selectedCategory.toLowerCase()

    const searchMatch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase())

    return categoryMatch && searchMatch
  })

  return (
    <div className="px-2 sm:px-6 lg:px-2 py-12">
      <CoursesHeader />

      <CourseFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        search={search}
        setSearch={setSearch}
        categories={categories}
      />

      {/* Loading & Error */}
      {loading && <Spinner />}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Filtered Course Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No courses found in this category.
          </p>
        )}
      </div>
      <WhyLearnUs />
    </div>
  )
}

export default CourseView
