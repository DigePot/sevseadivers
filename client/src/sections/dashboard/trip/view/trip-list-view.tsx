import React, { useState, useMemo, useEffect } from "react"
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"
import { useTrips } from "../hooks/use-trips"
import type { Trip } from "../../../../types/trip"
import { useDeleteTripMutation } from "../../../../store/trip"

export const TripListView: React.FC = () => {
  const [deleteTrip, { isLoading: isDeleting }] = useDeleteTripMutation()
  const { allTrips, isLoading, error } = useTrips()

  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    activityType: "",
    minPrice: "",
    maxPrice: "",
    date: "",
  })
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Trip
    direction: string
  } | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters, sortConfig])

  // Handle sorting
  const handleSort = (key: keyof Trip) => {
    let direction = "ascending"
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Apply search, filters, and sorting
  const filteredTrips = useMemo(() => {
    if (!allTrips) return []

    let result = [...allTrips]

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (trip) =>
          trip.title.toLowerCase().includes(term) ||
          trip.description.toLowerCase().includes(term) ||
          trip.destination.toLowerCase().includes(term) ||
          trip.activityType.toLowerCase().includes(term)
      )
    }

    // Apply filters
    if (filters.activityType) {
      result = result.filter(
        (trip) => trip.activityType === filters.activityType
      )
    }
    if (filters.minPrice) {
      result = result.filter((trip) => trip.price >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter((trip) => trip.price <= Number(filters.maxPrice))
    }
    if (filters.date) {
      result = result.filter((trip) => trip.date === filters.date)
    }

    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        // Handle numeric sorting for price
        if (sortConfig.key === "price") {
          return sortConfig.direction === "ascending"
            ? a.price - b.price
            : b.price - a.price
        }

        // Handle date sorting
        if (sortConfig.key === "date") {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return sortConfig.direction === "ascending"
            ? dateA - dateB
            : dateB - dateA
        }

        // Default string sorting
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [allTrips, searchTerm, filters, sortConfig])

  // Get unique activity types for filter dropdown
  const activityTypes = useMemo(() => {
    if (!allTrips) return []
    return [...new Set(allTrips.map((trip) => trip.activityType))]
  }, [allTrips])

  // Reset filters
  const resetFilters = () => {
    setFilters({
      activityType: "",
      minPrice: "",
      maxPrice: "",
      date: "",
    })
  }

  // Pagination calculations
  const totalItems = filteredTrips.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = filteredTrips.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <h1>Loading...</h1>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 rounded-xl p-6 text-center">
        <h3 className="text-red-800 font-medium">Error loading trips</h3>
        <p className="text-red-600 mt-2">
          {(error as any)?.data?.message || "Please try again later"}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Controls */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
            >
              <FiFilter />
              Filters
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                value={filters.activityType}
                onChange={(e) =>
                  setFilters({ ...filters, activityType: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {allTrips && allTrips.length > 0 && (
        <div className="px-4 md:px-6 py-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
          <div className="text-gray-700 mb-2 sm:mb-0">
            Showing{" "}
            <span className="font-medium">
              {startIndex + 1} - {endIndex}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> trips
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="rounded-lg bg-gray-200 h-16 w-16" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && allTrips && allTrips.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No trips found</div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Table - Desktop */}
      {!isLoading && allTrips && allTrips.length > 0 && (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      Trip
                      {sortConfig?.key === "title" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("destination")}
                  >
                    <div className="flex items-center gap-1">
                      Destination
                      {sortConfig?.key === "destination" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("activityType")}
                  >
                    <div className="flex items-center gap-1">
                      Activity
                      {sortConfig?.key === "activityType" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortConfig?.key === "date" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-1">
                      Price
                      {sortConfig?.key === "price" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        ))}
                    </div>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((trip) => (
                    <tr
                      key={`${trip.id}-${trip.title}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 rounded-lg object-cover border"
                              src={trip.imageUrl}
                              alt={trip.title}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/150?text=No+Image"
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {trip.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                              {trip.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiMapPin className="mr-1.5 h-4 w-4 text-blue-500" />
                          {trip.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {trip.activityType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiCalendar className="mr-1.5 h-4 w-4 text-green-500" />
                          {new Date(trip.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <FiDollarSign className="mr-1.5 h-4 w-4 text-yellow-500" />
                          ${trip.price}
                          <span className="ml-2 text-xs text-gray-500 flex items-center">
                            <FiClock className="mr-1" />
                            {trip.duration}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          onClick={() => deleteTrip(trip.id)}
                        >
                          {isDeleting ? "Deleting" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                          No trips found matching your criteria
                        </div>
                        <button
                          onClick={() => {
                            setSearchTerm("")
                            resetFilters()
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-4 p-4">
            {currentItems.length > 0 ? (
              currentItems.map((trip) => (
                <div
                  key={`${trip.id}-${trip.title}-mobile`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded-lg object-cover border"
                          src={trip.imageUrl}
                          alt={trip.title}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/150?text=No+Image"
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {trip.title}
                          </h3>
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {trip.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <FiMapPin className="mr-1.5 h-3 w-3 text-blue-500" />
                        <span>{trip.destination}</span>
                      </div>

                      <div className="flex items-center text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {trip.activityType}
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-600">
                        <FiCalendar className="mr-1.5 h-3 w-3 text-green-500" />
                        <span>{new Date(trip.date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center text-xs text-gray-600">
                        <FiDollarSign className="mr-1.5 h-3 w-3 text-yellow-500" />
                        <span>${trip.price}</span>
                        <span className="mx-1">•</span>
                        <FiClock className="mr-1.5 h-3 w-3 text-gray-400" />
                        <span>{trip.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  No trips found matching your criteria
                </div>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    resetFilters()
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
              {/* Mobile pagination */}
              <div className="flex-1 flex justify-between md:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>

              {/* Desktop pagination */}
              <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{endIndex}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
