import React, { useEffect, useMemo, useState } from "react"
import {
  FiBook,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiFilter,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi"
import type { Booking } from "../../../../types/booking"
import { useAllBooking } from "../hooks"
import { useUpdateBookingStatusMutation } from "../../../../store/booking"

// Define BookingStatus type for type safety
type BookingStatus = Booking["status"]

// ============================================================================
// Type Definitions
// ============================================================================

type SortConfig = {
  key: keyof Booking | "userName" | "courseTitle"
  direction: string
}

type FiltersState = {
  status: string
  userName: string
  courseTitle: string
  startDate: string
  endDate: string
}

interface StatusSelectorProps {
  currentStatus: BookingStatus
  onStatusChange: (status: BookingStatus) => void
  isUpdating: boolean
}

// ============================================================================
// Main Component: BookingListView
// ============================================================================

export const BookingListView: React.FC = () => {
  // --- Hooks ---
  const { allBooking, isLoading, error, refetch } = useAllBooking()
  const [updateBookingStatus] = useUpdateBookingStatusMutation()

  // --- State ---
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FiltersState>({
    status: "",
    userName: "",
    courseTitle: "",
    startDate: "",
    endDate: "",
  })
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // --- Handlers ---
  const handleSort = (key: SortConfig["key"]) => {
    let direction = "ascending"
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      userName: "",
      courseTitle: "",
      startDate: "",
      endDate: "",
    })
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
    filterName: keyof FiltersState,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  const closeBookingDetails = () => {
    setSelectedBooking(null)
  }

  // Update booking status handler
  const handleStatusUpdate = async (id: number, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus({ id, status: newStatus }).unwrap()
      refetch()

      // Update selected booking if it's the one being updated
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev) =>
          prev ? { ...prev, status: newStatus } : prev
        )
      }
    } catch (error) {
      console.error("Failed to update booking status:", error)
    }
  }

  // --- Memoized Derived State ---
  const filteredBookings = useMemo(() => {
    if (!allBooking) return []
    let result = [...allBooking]

    // Search logic
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (booking) =>
          booking.User.fullName?.toLowerCase().includes(term) ||
          booking.User.username?.toLowerCase().includes(term) ||
          booking.User.email?.toLowerCase().includes(term) ||
          booking.Course?.title?.toLowerCase().includes(term) ||
          booking.status?.toLowerCase().includes(term)
      )
    }

    // Filter logic
    if (filters.status)
      result = result.filter((booking) => booking.status === filters.status)
    if (filters.userName)
      result = result.filter(
        (booking) =>
          booking.User.fullName
            ?.toLowerCase()
            .includes(filters.userName.toLowerCase()) ||
          booking.User.username
            ?.toLowerCase()
            .includes(filters.userName.toLowerCase())
      )
    if (filters.courseTitle)
      result = result.filter((booking) =>
        booking.Course?.title
          ?.toLowerCase()
          .includes(filters.courseTitle.toLowerCase())
      )
    if (filters.startDate)
      result = result.filter(
        (booking) =>
          new Date(booking.bookingDate) >= new Date(filters.startDate)
      )
    if (filters.endDate)
      result = result.filter(
        (booking) => new Date(booking.bookingDate) <= new Date(filters.endDate)
      )

    // Sorting logic
    if (sortConfig) {
      result.sort((a, b) => {
        let valA: any, valB: any

        if (sortConfig.key === "userName") {
          valA = a.User.fullName || a.User.username
          valB = b.User.fullName || b.User.username
        } else if (sortConfig.key === "courseTitle") {
          valA = a.Course?.title || ""
          valB = b.Course?.title || ""
        } else {
          valA = a[sortConfig.key as keyof Booking]
          valB = b[sortConfig.key as keyof Booking]
        }

        // Handle null/undefined values
        if (valA == null) valA = ""
        if (valB == null) valB = ""

        if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1
        if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1
        return 0
      })
    }

    return result
  }, [allBooking, searchTerm, filters, sortConfig])

  const statusOptions: BookingStatus[] = ["pending", "completed", "cancelled"]
  const userNames = useMemo(() => {
    if (!allBooking) return []
    const names = allBooking
      .map((b) => b.User.fullName || b.User.username)
      .filter(Boolean)
    return Array.from(new Set(names))
  }, [allBooking])

  const courseTitles = useMemo(() => {
    if (!allBooking) return []
    const titles = allBooking
      .map((b) => b.Course?.title)
      .filter(Boolean) as string[]
    return Array.from(new Set(titles))
  }, [allBooking])

  const totalItems = filteredBookings.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = filteredBookings.slice(startIndex, endIndex)

  // --- Effects ---
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters, sortConfig, itemsPerPage])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedBooking) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedBooking])

  // --- Render Logic ---
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <BookingListHeader
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onResetFilters={resetFilters}
      />

      <FilterPanel
        isOpen={showFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        statusOptions={statusOptions}
        userNames={userNames}
        courseTitles={courseTitles}
      />

      {totalItems > 0 ? (
        <>
          <BookingListSummary
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
          <BookingTable
            bookings={currentItems}
            onSort={handleSort}
            sortConfig={sortConfig}
            onViewDetails={openBookingDetails}
          />
          <BookingCardList
            bookings={currentItems}
            onViewDetails={openBookingDetails}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyState onResetFilters={resetFilters} />
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={closeBookingDetails}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}

// ============================================================================
// Sub-components
// ============================================================================

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

const ErrorState: React.FC<{ error: any }> = ({ error }) => (
  <div className="bg-red-50 rounded-xl p-6 text-center">
    <h3 className="text-red-800 font-medium">Error loading bookings</h3>
    <p className="text-red-600 mt-2">
      {error?.data?.message || "Please try again later"}
    </p>
  </div>
)

const EmptyState: React.FC<{ onResetFilters: () => void }> = ({
  onResetFilters,
}) => (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">
      No bookings found matching your criteria.
    </div>
    <button
      onClick={onResetFilters}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Reset Filters
    </button>
  </div>
)

// --- BookingListHeader ---
interface BookingListHeaderProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showFilters: boolean
  onToggleFilters: () => void
  onResetFilters: () => void
}
const BookingListHeader: React.FC<BookingListHeaderProps> = ({
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
          placeholder="Search bookings..."
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

// --- FilterPanel ---
interface FilterPanelProps {
  isOpen: boolean
  filters: FiltersState
  onFilterChange: (name: keyof FiltersState, value: string) => void
  statusOptions: BookingStatus[]
  userNames: string[]
  courseTitles: string[]
}
const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  filters,
  onFilterChange,
  statusOptions,
  userNames,
  courseTitles,
}) => {
  if (!isOpen) return null
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User
          </label>
          <select
            value={filters.userName}
            onChange={(e) => onFilterChange("userName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Users</option>
            {userNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course
          </label>
          <select
            value={filters.courseTitle}
            onChange={(e) => onFilterChange("courseTitle", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Courses</option>
            {courseTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              placeholder="Start"
              value={filters.startDate}
              onChange={(e) => onFilterChange("startDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="date"
              placeholder="End"
              value={filters.endDate}
              onChange={(e) => onFilterChange("endDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// --- BookingListSummary ---
const BookingListSummary: React.FC<{
  startIndex: number
  endIndex: number
  totalItems: number
  itemsPerPage: number
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}> = ({
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
      <span className="font-medium">{totalItems}</span> bookings
    </div>
    <div className="flex items-center gap-2">
      <span className="text-gray-700">Items per page:</span>
      <select
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
        className="border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
)

// --- BookingTable ---
interface BookingTableProps {
  bookings: Booking[]
  onSort: (key: SortConfig["key"]) => void
  sortConfig: SortConfig | null
  onViewDetails: (booking: Booking) => void
}
const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onSort,
  sortConfig,
  onViewDetails,
}) => {
  const headers: { key: SortConfig["key"]; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "userName", label: "User" },
    { key: "courseTitle", label: "Course" },
    { key: "bookingDate", label: "Booking Date" },
    { key: "status", label: "Status" },
  ]

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort(header.key)}
              >
                <div className="flex items-center gap-1">
                  {header.label}
                  {sortConfig?.key === header.key &&
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
          {bookings.map((booking) => (
            <BookingTableRow
              key={booking.id}
              booking={booking}
              onViewDetails={onViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- BookingTableRow ---
interface BookingTableRowProps {
  booking: Booking
  onViewDetails: (booking: Booking) => void
}
const BookingTableRow: React.FC<BookingTableRowProps> = ({
  booking,
  onViewDetails,
}) => {
  const userName = booking.User.fullName || booking.User.username
  const courseTitle = booking.Course?.title || "No Course"
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString()

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        #{booking.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm">
          <FiUser className="mr-1.5 h-4 w-4 text-blue-500" />
          {userName}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm">
          <FiBook className="mr-1.5 h-4 w-4 text-green-500" />
          {courseTitle}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm">
          <FiCalendar className="mr-1.5 h-4 w-4 text-purple-500" />
          {bookingDate}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            booking.status === "completed"
              ? "bg-green-100 text-green-800"
              : booking.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : booking.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onViewDetails(booking)}
          className="text-blue-600 hover:text-blue-900 cursor-pointer font-medium"
        >
          View Details
        </button>
      </td>
    </tr>
  )
}

// --- BookingCardList ---
interface BookingCardListProps {
  bookings: Booking[]
  onViewDetails: (booking: Booking) => void
}
const BookingCardList: React.FC<BookingCardListProps> = ({
  bookings,
  onViewDetails,
}) => (
  <div className="md:hidden grid grid-cols-1 gap-4 p-4">
    {bookings.map((booking) => (
      <BookingCard
        key={booking.id}
        booking={booking}
        onViewDetails={onViewDetails}
      />
    ))}
  </div>
)

// --- BookingCard ---
interface BookingCardProps {
  booking: Booking
  onViewDetails: (booking: Booking) => void
}
const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
}) => {
  const userName = booking.User.fullName || booking.User.username
  const courseTitle = booking.Course?.title || "No Course"
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Booking #{booking.id}
            </h3>
            <p className="text-xs text-gray-500">{bookingDate}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              booking.status === "completed"
                ? "bg-green-100 text-green-800"
                : booking.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : booking.status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600">
          <div className="flex items-center">
            <FiUser className="mr-1.5 h-3 w-3 text-blue-500" />
            <span>{userName}</span>
          </div>
          <div className="flex items-center">
            <FiBook className="mr-1.5 h-3 w-3 text-green-500" />
            <span>{courseTitle}</span>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => onViewDetails(booking)}
            className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

// Status Selector Component
const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  isUpdating,
}) => {
  const statusOptions: {
    value: BookingStatus
    label: string
    color: string
  }[] = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((status) => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          disabled={isUpdating}
          className={`px-3 py-1.5 text-sm rounded-full transition-all ${
            status.color
          } ${
            currentStatus === status.value
              ? "ring-2 ring-offset-1 ring-blue-500"
              : "opacity-80 hover:opacity-100"
          } ${isUpdating ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {status.label}
          {isUpdating && currentStatus === status.value && (
            <span className="ml-2 animate-pulse">Updating...</span>
          )}
        </button>
      ))}
    </div>
  )
}

// --- BookingDetailsModal ---
interface BookingDetailsModalProps {
  booking: Booking
  onClose: () => void
  onStatusUpdate: (id: number, status: BookingStatus) => void
}
const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
  onStatusUpdate,
}) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [localStatus, setLocalStatus] = useState(booking.status)
  const [error, setError] = useState<string | null>(null)

  // Update local status when booking prop changes
  useEffect(() => {
    setLocalStatus(booking.status)
  }, [booking])

  const userName = booking.User.fullName || booking.User.username
  const userEmail = booking.User.email || "No email"
  const courseTitle = booking.Course?.title || "No Course"
  const courseDescription = booking.Course?.description || "No description"
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString()
  const createdAt = new Date(booking.createdAt).toLocaleString()
  const updatedAt = new Date(booking.updatedAt).toLocaleString()

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (newStatus === localStatus) return

    setIsUpdating(true)
    setError(null) // Clear previous errors

    try {
      setLocalStatus(newStatus)
      await onStatusUpdate(booking.id, newStatus)
    } catch (err: any) {
      console.error("Failed to update status:", err)
      setError(
        err?.data?.message || "Failed to update status. Please try again later."
      )
      setLocalStatus(booking.status) // Revert to original status
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      {/* Blur Background */}
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 md:p-6 border-b">
            <h2 className="text-xl font-bold">Booking Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 md:p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                <p className="font-medium">Update Error:</p>
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <FiUser className="mr-2 text-blue-500" /> User Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {userName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {userEmail}
                  </p>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <FiCalendar className="mr-2 text-purple-500" /> Booking
                  Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Booking ID:</span> #
                    {booking.id}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {bookingDate}
                  </p>
                  <div>
                    <span className="font-medium">Status:</span>
                    <div className="mt-2">
                      <StatusSelector
                        currentStatus={localStatus}
                        onStatusChange={handleStatusChange}
                        isUpdating={isUpdating}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <FiBook className="mr-2 text-green-500" /> Course Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Title:</span> {courseTitle}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {courseDescription}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="md:col-span-2 border-t pt-4 mt-2 text-sm text-gray-500">
                <p>
                  <span className="font-medium">Created At:</span> {createdAt}
                </p>
                <p>
                  <span className="font-medium">Last Updated:</span> {updatedAt}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 md:p-6 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// --- PaginationControls ---
const PaginationControls: React.FC<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}> = ({ currentPage, totalPages, onPageChange }) => {
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
