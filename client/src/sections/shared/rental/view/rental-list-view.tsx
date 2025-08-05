import React, { useEffect, useMemo, useState } from "react"
import {
  FiAlertTriangle,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiDollarSign,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiEdit,
  FiMapPin,
} from "react-icons/fi"
import { useDeleteRentalMutation } from "../../../../store/rental"
import type { Rental } from "../../../../types/rental"
import { useRentals } from "../hooks/use-rentals"
import { Link } from "react-router"
import { paths } from "../../../../routes/paths"

type SortConfig = { key: keyof Rental; direction: string }
type FiltersState = {
  status: string
  minPrice: string
  maxPrice: string
  startDate: string
  endDate: string
}

export const RentalListView: React.FC = () => {
  // --- Hooks ---
  const [deleteRental, { isLoading: isDeleting }] = useDeleteRentalMutation()
  const { allRentals, isLoading, error } = useRentals()

  // --- State ---
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FiltersState>({
    status: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
  })
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [rentalToDelete, setRentalToDelete] = useState<number | null>(null)

  // --- Handlers ---
  const handleOpenDeleteModal = (rentalId: number) => {
    setRentalToDelete(rentalId)
    setIsDeleteModalOpen(true)
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setRentalToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (rentalToDelete !== null) {
      console.log("rentalToDelete", rentalToDelete)
      try {
        await deleteRental(rentalToDelete).unwrap()
        handleCancelDelete()
      } catch (err) {
        console.error("Failed to delete rental:", err)
      }
    }
  }

  const handleSort = (key: keyof Rental) => {
    let direction = "ascending"
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      minPrice: "",
      maxPrice: "",
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

  // --- Memoized Derived State ---
  const filteredRentals = useMemo(() => {
    if (!allRentals) return []
    let result = [...allRentals]

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (rental) =>
          rental.title.toLowerCase().includes(term) ||
          rental.description.toLowerCase().includes(term)
      )
    }

    // Filters
    if (filters.status)
      result = result.filter((rental) => rental.status === filters.status)
    if (filters.minPrice)
      result = result.filter(
        (rental) => rental.price >= Number(filters.minPrice)
      )
    if (filters.maxPrice)
      result = result.filter(
        (rental) => rental.price <= Number(filters.maxPrice)
      )

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]
        if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1
        if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1
        return 0
      })
    }
    return result
  }, [allRentals, searchTerm, filters, sortConfig])

  const statusOptions = useMemo(() => {
    if (!allRentals) return []
    return [...new Set(allRentals.map((rental) => rental.status))]
  }, [allRentals])

  const totalItems = filteredRentals.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = filteredRentals.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(
    () => setCurrentPage(1),
    [searchTerm, filters, sortConfig, itemsPerPage]
  )

  // --- Render States ---
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute inset-y-0 left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rentals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"
            >
              <FiFilter /> Filters{" "}
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
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
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="px-4 md:px-6 py-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
        <div className="text-gray-700 mb-2 sm:mb-0">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">{endIndex}</span> of{" "}
          <span className="font-medium">{totalItems}</span> rentals
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Rental List */}
      {totalItems > 0 ? (
        <>
          {/* Table View (Desktop) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["title", "Location", "price", "status", "Duration"].map(
                    (key) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort(key as keyof Rental)}
                      >
                        <div className="flex items-center gap-1">
                          {key === "startDate"
                            ? "Start"
                            : key === "endDate"
                            ? "End"
                            : key}
                          {sortConfig?.key === key &&
                            (sortConfig.direction === "ascending" ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            ))}
                        </div>
                      </th>
                    )
                  )}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-16 w-16 rounded-lg object-cover border"
                          src={rental.imageUrl}
                          alt={rental.title}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {rental.title}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {rental.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium">
                        <FiMapPin className="mr-1.5 h-4 w-4 text-blue-500" />
                        {rental.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium">
                        <FiDollarSign className="mr-1.5 h-4 w-4 text-yellow-500" />
                        ${rental.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                          rental.status === "rented"
                            ? "bg-green-100 text-green-800"
                            : rental.status === "available"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <FiCalendar className="inline mr-1.5 h-4 w-4 text-green-500" />
                      {rental.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={paths.shared.rental.edit(rental.id.toString())}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FiEdit className="inline mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleOpenDeleteModal(rental.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                      >
                        <FiTrash2 className="inline mr-1" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card View (Mobile) */}
          <div className="lg:hidden grid grid-cols-1 gap-4 p-4">
            {currentItems.map((rental) => (
              <div
                key={rental.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <img
                      className="h-16 w-16 rounded-lg object-cover border"
                      src={rental.imageUrl}
                      alt={rental.title}
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {rental.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            rental.status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {rental.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {rental.description}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <FiDollarSign className="mr-1.5 h-3 w-3 text-yellow-500" />
                          <span>${rental.price}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link
                          to={paths.shared.rental.edit(rental.id.toString())}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <FiEdit className="mr-1" /> Edit
                        </Link>
                        <button
                          onClick={() => handleOpenDeleteModal(rental.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-800 text-sm disabled:text-gray-400 flex items-center"
                        >
                          <FiTrash2 className="mr-1" />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
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
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            No rentals found matching your criteria.
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Rental
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this rental? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Loading State Component
const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

// Error State Component
const ErrorState: React.FC<{ error: any }> = ({ error }) => (
  <div className="bg-red-50 rounded-xl p-6 text-center">
    <h3 className="text-red-800 font-medium">Error loading rentals</h3>
    <p className="text-red-600 mt-2">
      {error?.message || "Please try again later"}
    </p>
  </div>
)
