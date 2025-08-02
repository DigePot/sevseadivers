// src/sections/dashboard/general/course/views/course-list-view.tsx
import React, { useEffect, useMemo, useState } from "react"
import {
  FiAlertTriangle,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiClock,
  FiDollarSign,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiEdit,
} from "react-icons/fi"
import { useDeleteCourseMutation } from "../../../../store/course"
import type { Course } from "../../../../types/course"
import { useCourses } from "../hooks/use-courses"
import { Link } from "react-router"
import { paths } from "../../../../routes/paths"

// ============================================================================
// Type Definitions
// ============================================================================

type CourseSortConfig = { key: keyof Course; direction: string }

type CourseFiltersState = {
  minPrice: string
  maxPrice: string
  duration: string
}

// ============================================================================
// Main Controller Component: CourseListView
// ============================================================================

export const CourseListView: React.FC = () => {
  // --- Hooks ---
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation()
  const { allCourses, isLoading, error } = useCourses()

  // --- State ---
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<CourseFiltersState>({
    minPrice: "",
    maxPrice: "",
    duration: "",
  })
  const [sortConfig, setSortConfig] = useState<CourseSortConfig | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [courseToDeleteId, setCourseToDeleteId] = useState<number | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  // --- Handlers ---
  const handleOpenDeleteModal = (courseId: number) => {
    setCourseToDeleteId(courseId)
    setShowDeleteConfirmation(true)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
    setCourseToDeleteId(null)
  }

  const handleConfirmDelete = async () => {
    if (courseToDeleteId !== null) {
      try {
        await deleteCourse(courseToDeleteId).unwrap()
        handleCancelDelete()
      } catch (err) {
        console.error("Failed to delete the course:", err)
      }
    }
  }

  const handleSort = (key: keyof Course) => {
    let direction = "ascending"
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const resetFilters = () => {
    setFilters({ minPrice: "", maxPrice: "", duration: "" })
    setSearchTerm("")
    setSortConfig(null)
  }

  const handlePageChange = (page: number) => setCurrentPage(page)

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value))
  }

  const handleFilterChange = (
    filterName: keyof CourseFiltersState,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  // --- Memoized Derived State ---
  const filteredCourses = useMemo(() => {
    if (!allCourses) return []
    let result = [...allCourses]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term)
      )
    }

    if (filters.minPrice)
      result = result.filter(
        (course) => course.price >= Number(filters.minPrice)
      )
    if (filters.maxPrice)
      result = result.filter(
        (course) => course.price <= Number(filters.maxPrice)
      )

    if (filters.duration) {
      result = result.filter((course) =>
        course.duration.toLowerCase().includes(filters.duration.toLowerCase())
      )
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]

        if (typeof valA === "string" && typeof valB === "string") {
          return sortConfig.direction === "ascending"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "ascending"
            ? valA - valB
            : valB - valA
        }

        return 0
      })
    }

    return result
  }, [allCourses, searchTerm, filters, sortConfig])

  const courseDurations = useMemo(() => {
    if (!allCourses) return []
    return [...new Set(allCourses.map((course) => course.duration))]
  }, [allCourses])

  const totalItems = filteredCourses.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = filteredCourses.slice(startIndex, endIndex)

  // --- Effects ---
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters, sortConfig, itemsPerPage])

  // --- Render Logic ---
  if (isLoading) return <CourseLoadingState />
  if (error) return <CourseErrorState error={error} />

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <CourseListHeader
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onResetFilters={resetFilters}
      />

      <CourseFilterPanel
        isOpen={showFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        courseDurations={courseDurations}
        onResetFilters={resetFilters}
      />

      {totalItems > 0 ? (
        <>
          <CourseListSummary
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
          <CourseTable
            courses={currentItems}
            onSort={handleSort}
            sortConfig={sortConfig}
            onDelete={handleOpenDeleteModal}
            isDeleting={isDeleting}
            deletingId={courseToDeleteId}
          />
          <CourseCardList
            courses={currentItems}
            onDelete={handleOpenDeleteModal}
            isDeleting={isDeleting}
            deletingId={courseToDeleteId}
          />
          <CoursePaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <CourseEmptyState onResetFilters={resetFilters} />
      )}

      <CourseDeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        isDeleting={isDeleting}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

// ============================================================================
// Presentational Sub-components & Their Prop Interfaces
// ============================================================================

const CourseLoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

const CourseErrorState: React.FC<{ error: any }> = ({ error }) => (
  <div className="bg-red-50 rounded-xl p-6 text-center">
    <h3 className="text-red-800 font-medium">Error loading courses</h3>
    <p className="text-red-600 mt-2">
      {error?.data?.message || "Please try again later"}
    </p>
  </div>
)

const CourseEmptyState: React.FC<{ onResetFilters: () => void }> = ({
  onResetFilters,
}) => (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">
      No courses found matching your criteria.
    </div>
    <button
      onClick={onResetFilters}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Reset Filters
    </button>
  </div>
)

// --- CourseListHeader ---
interface CourseListHeaderProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showFilters: boolean
  onToggleFilters: () => void
  onResetFilters: () => void
}
const CourseListHeader: React.FC<CourseListHeaderProps> = ({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onResetFilters,
}) => (
  <div className="p-4 md:p-6 border-b border-gray-200">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <FiSearch className="absolute inset-y-0 left-3 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={onSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
        >
          <FiFilter /> Filters{" "}
          {showFilters ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
)

// --- CourseFilterPanel ---
interface CourseFilterPanelProps {
  isOpen: boolean
  filters: CourseFiltersState
  onFilterChange: (name: keyof CourseFiltersState, value: string) => void
  courseDurations: string[]
  onResetFilters: () => void
}
const CourseFilterPanel: React.FC<CourseFilterPanelProps> = ({
  isOpen,
  filters,
  onFilterChange,
  courseDurations,
  onResetFilters,
}) => {
  if (!isOpen) return null
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <select
            value={filters.duration}
            onChange={(e) => onFilterChange("duration", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Durations</option>
            {courseDurations.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onResetFilters}
            className="w-full py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

// --- CourseListSummary ---
interface CourseListSummaryProps {
  startIndex: number
  endIndex: number
  totalItems: number
  itemsPerPage: number
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
const CourseListSummary: React.FC<CourseListSummaryProps> = ({
  startIndex,
  endIndex,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
}) => (
  <div className="px-4 md:px-6 py-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
    <div className="text-gray-700 mb-2 sm:mb-0">
      Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
      <span className="font-medium">{endIndex}</span> of{" "}
      <span className="font-medium">{totalItems}</span> courses
    </div>
    <div className="flex items-center gap-2">
      <span className="text-gray-700">Courses per page:</span>
      <select
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
        className="border border-gray-300 rounded-md px-2 py-1"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
)

// --- CourseTable ---
interface CourseTableProps {
  courses: Course[]
  onSort: (key: keyof Course) => void
  sortConfig: CourseSortConfig | null
  onDelete: (id: number) => void
  isDeleting: boolean
  deletingId: number | null
}
const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  onSort,
  sortConfig,
  onDelete,
  isDeleting,
  deletingId,
}) => (
  <div className="hidden xl:block lg:w-[990px] overflow-x-scroll">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {["title", "price", "duration", "createdAt"].map((key) => (
            <th
              key={key}
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort(key as keyof Course)}
            >
              <div className="flex items-center gap-1">
                {key === "createdAt" ? "Created" : key}
                {sortConfig?.key === key &&
                  (sortConfig.direction === "ascending" ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  ))}
              </div>
            </th>
          ))}
          <th scope="col" className="relative px-6 py-3">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {courses.map((course) => (
          <CourseTableRow
            key={course.id}
            course={course}
            onDelete={onDelete}
            isDeleting={isDeleting && deletingId === course.id}
          />
        ))}
      </tbody>
    </table>
  </div>
)

// --- CourseTableRow ---
interface CourseTableRowProps {
  course: Course
  onDelete: (id: number) => void
  isDeleting: boolean
}
const CourseTableRow: React.FC<CourseTableRowProps> = ({
  course,
  onDelete,
  isDeleting,
}) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        {course.imageUrl ? (
          <img
            className="h-16 w-16 rounded-lg object-cover border flex-shrink-0"
            // src={course.imageUrl}
            src={course.imageUrl.replace(
              "http://localhost:5000",
              "https://api.sevseadivers.com"
            )}
            alt={course.title}
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        )}
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {course.title}
          </div>
          <div className="text-sm text-gray-500 max-w-xs truncate">
            {course.description}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center text-sm font-medium">
        <FiDollarSign className="mr-1.5 h-4 w-4 text-yellow-500" />$
        {course.price}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center text-sm">
        <FiClock className="mr-1.5 h-4 w-4 text-green-500" />
        {course.duration}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(course.createdAt).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <Link
        to={paths.shared.course.edit(course.id.toString())}
        className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
      >
        <FiEdit className="inline mr-1" /> Edit
      </Link>
      <button
        onClick={() => onDelete(course.id)}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-900 disabled:text-gray-400 cursor-pointer"
      >
        <FiTrash2 className="inline mr-1" />
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </td>
  </tr>
)

// --- CourseCardList ---
interface CourseCardListProps {
  courses: Course[]
  onDelete: (id: number) => void
  isDeleting: boolean
  deletingId: number | null
}
const CourseCardList: React.FC<CourseCardListProps> = ({
  courses,
  onDelete,
  isDeleting,
  deletingId,
}) => (
  <div className="xl:hidden grid grid-cols-1 gap-4 p-4">
    {courses.map((course) => (
      <CourseCard
        key={course.id}
        course={course}
        onDelete={onDelete}
        isDeleting={isDeleting && deletingId === course.id}
      />
    ))}
  </div>
)

// --- CourseCard ---
interface CourseCardProps {
  course: Course
  onDelete: (id: number) => void
  isDeleting: boolean
}
const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onDelete,
  isDeleting,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-4">
      <div className="flex items-start">
        {course.imageUrl ? (
          <img
            className="h-16 w-16 rounded-lg object-cover border"
            // src={course.imageUrl}
            // src={
            //   `http://api.sevseadivers.com/${course.imageUrl}`
            //   // "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
            // }
            src={course.imageUrl.replace(
              "http://localhost:5000",
              "https://api.sevseadivers.com"
            )}
            alt={course.title}
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        )}
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              {course.title}
            </h3>
            <div className="flex gap-2">
              <Link
                to={paths.shared.course.edit(course.id.toString())}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <FiEdit />
              </Link>
              <button
                onClick={() => onDelete(course.id)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 text-sm disabled:text-gray-400 cursor-pointer"
              >
                {isDeleting ? "..." : <FiTrash2 />}
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {course.description}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center">
          <FiDollarSign className="mr-1.5 h-3 w-3 text-yellow-500" />
          <span>${course.price}</span>
        </div>
        <div className="flex items-center">
          <FiClock className="mr-1.5 h-3 w-3 text-green-500" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center">
          <FiCalendar className="mr-1.5 h-3 w-3 text-blue-500" />
          <span>{new Date(course.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  </div>
)

// --- CoursePaginationControls ---
interface CoursePaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
const CoursePaginationControls: React.FC<CoursePaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4, 5]
    if (currentPage >= totalPages - 2)
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ]
  }, [currentPage, totalPages])
  return (
    <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
      <div className="flex-1 flex justify-between md:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden md:flex-1 md:flex md:items-center md:justify-end">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === pageNum
                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  )
}

// --- CourseDeleteConfirmationModal ---
interface CourseDeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}
const CourseDeleteConfirmationModal: React.FC<
  CourseDeleteConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FiAlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-lg font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Confirm Delete
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this course? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="inline-flex cursor-pointer w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="mt-3 inline-flex cursor-pointer w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
