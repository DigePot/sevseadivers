// src/sections/dashboard/general/gallery/views/gallery-list-view.tsx
import React, { useEffect, useMemo, useState } from "react"
import {
  FiAlertTriangle,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiFilter,
  FiImage,
  FiSearch,
} from "react-icons/fi"
import { useDeleteGalleryMutation } from "../../../../store/gallery"
import type { Gallery } from "../../../../types/gallery"
import { useAllGallery } from "../hooks/use-all-gallery"
import { Link } from "react-router"
import { paths } from "../../../../routes/paths"

// ============================================================================
// Type Definitions
// ============================================================================

type GallerySortConfig = { key: keyof Gallery; direction: string }

type GalleryFiltersState = {
  title: string
  description: string
  mediaType: string
}

// ============================================================================
// Main Controller Component: GalleryListView
// ============================================================================

export const GalleryListView: React.FC = () => {
  // --- Hooks ---
  const [deleteGalleryApi, { isLoading: isDeleting }] =
    useDeleteGalleryMutation()
  const { allGallery, isLoading, error } = useAllGallery()

  // --- State ---
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<GalleryFiltersState>({
    title: "",
    description: "",
    mediaType: "",
  })
  const [sortConfig, setSortConfig] = useState<GallerySortConfig | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [galleryToDeleteId, setGalleryToDeleteId] = useState<number | null>(
    null
  )
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  // --- Handlers ---
  const handleOpenDeleteModal = (galleryId: number) => {
    setGalleryToDeleteId(galleryId)
    setShowDeleteConfirmation(true)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
    setGalleryToDeleteId(null)
  }

  const handleConfirmDelete = async () => {
    if (galleryToDeleteId !== null) {
      try {
        await deleteGalleryApi(galleryToDeleteId).unwrap()
        handleCancelDelete()
      } catch (err) {
        console.error("Failed to delete the gallery item:", err)
      }
    }
  }

  const handleSort = (key: keyof Gallery) => {
    let direction = "ascending"
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const resetFilters = () => {
    setFilters({ title: "", description: "", mediaType: "" })
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
    filterName: keyof GalleryFiltersState,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  // --- Memoized Derived State ---
  const filteredGallery = useMemo(() => {
    if (!allGallery) return []
    let result = [...allGallery]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (gallery) =>
          gallery.title.toLowerCase().includes(term) ||
          gallery.description.toLowerCase().includes(term) ||
          gallery.mediaType.toLowerCase().includes(term)
      )
    }

    if (filters.title) {
      result = result.filter((gallery) =>
        gallery.title.toLowerCase().includes(filters.title.toLowerCase())
      )
    }
    if (filters.description) {
      result = result.filter((gallery) =>
        gallery.description
          .toLowerCase()
          .includes(filters.description.toLowerCase())
      )
    }
    if (filters.mediaType) {
      result = result.filter(
        (gallery) => gallery.mediaType === filters.mediaType
      )
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]

        // FIX: Specifically handle date strings for correct chronological sorting
        if (sortConfig.key === "createdAt") {
          const dateA = new Date(valA as string).getTime()
          const dateB = new Date(valB as string).getTime()
          return sortConfig.direction === "ascending"
            ? dateA - dateB
            : dateB - dateA
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return sortConfig.direction === "ascending"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "ascending"
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number)
        }

        return 0
      })
    }

    return result
  }, [allGallery, searchTerm, filters, sortConfig])

  const mediaTypes = useMemo(() => {
    if (!allGallery) return []
    return [...new Set(allGallery.map((gallery) => gallery.mediaType))]
  }, [allGallery])

  const totalItems = filteredGallery.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = filteredGallery.slice(startIndex, endIndex)

  // --- Effects ---
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters, sortConfig, itemsPerPage])

  // --- Render Logic ---
  if (isLoading) return <GalleryLoadingState />
  if (error) return <GalleryErrorState error={error} />

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <GalleryListHeader
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onResetFilters={resetFilters}
      />

      <GalleryFilterPanel
        isOpen={showFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        mediaTypes={mediaTypes}
        onResetFilters={resetFilters}
      />

      {totalItems > 0 ? (
        <>
          <GalleryListSummary
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
          <GalleryTable
            gallery={currentItems}
            onSort={handleSort}
            sortConfig={sortConfig}
            onDelete={handleOpenDeleteModal}
            isDeleting={isDeleting}
            deletingId={galleryToDeleteId}
          />
          <GalleryCardList
            gallery={currentItems}
            onDelete={handleOpenDeleteModal}
            isDeleting={isDeleting}
            deletingId={galleryToDeleteId}
          />
          <GalleryPaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
          />
        </>
      ) : (
        <GalleryEmptyState onResetFilters={resetFilters} />
      )}

      <GalleryDeleteConfirmationModal
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

const GalleryLoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <h1>Loading...</h1>
  </div>
)

const GalleryErrorState: React.FC<{ error: any }> = ({ error }) => (
  <div className="bg-red-50 rounded-xl p-6 text-center">
    <h3 className="text-red-800 font-medium">Error loading gallery</h3>
    <p className="text-red-600 mt-2">
      {error?.data?.message || "Please try again later"}
    </p>
  </div>
)

const GalleryEmptyState: React.FC<{ onResetFilters: () => void }> = ({
  onResetFilters,
}) => (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">No gallery items found</div>
    <button
      onClick={onResetFilters}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Reset Filters
    </button>
  </div>
)

// --- GalleryListHeader ---
interface GalleryListHeaderProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showFilters: boolean
  onToggleFilters: () => void
  onResetFilters: () => void
}
const GalleryListHeader: React.FC<GalleryListHeaderProps> = ({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onResetFilters,
}) => (
  <div className="p-4 md:p-6 border-b border-gray-200">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search gallery..."
          value={searchTerm}
          onChange={onSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
        >
          <FiFilter />
          Filters
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

// --- GalleryFilterPanel ---
interface GalleryFilterPanelProps {
  isOpen: boolean
  filters: GalleryFiltersState
  onFilterChange: (name: keyof GalleryFiltersState, value: string) => void
  mediaTypes: string[]
  onResetFilters: () => void
}
const GalleryFilterPanel: React.FC<GalleryFilterPanelProps> = ({
  isOpen,
  filters,
  onFilterChange,
  mediaTypes,
  onResetFilters,
}) => {
  if (!isOpen) return null
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={filters.title}
          onChange={(e) => onFilterChange("title", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={filters.description}
          onChange={(e) => onFilterChange("description", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Media Type
        </label>
        <select
          value={filters.mediaType}
          onChange={(e) => onFilterChange("mediaType", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          {mediaTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          onClick={onResetFilters}
          className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

// --- GalleryListSummary ---
interface GalleryListSummaryProps {
  startIndex: number
  endIndex: number
  totalItems: number
  itemsPerPage: number
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
const GalleryListSummary: React.FC<GalleryListSummaryProps> = ({
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
      <span className="font-medium">{totalItems}</span> items
    </div>
    <div className="flex items-center gap-2">
      <span className="text-gray-700">Items per page:</span>
      <select
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
)

// --- GalleryTable ---
interface GalleryTableProps {
  gallery: Gallery[]
  onSort: (key: keyof Gallery) => void
  sortConfig: GallerySortConfig | null
  onDelete: (id: number) => void
  isDeleting: boolean
  deletingId: number | null
}
const GalleryTable: React.FC<GalleryTableProps> = ({
  gallery,
  onSort,
  sortConfig,
  onDelete,
  isDeleting,
  deletingId,
}) => (
  <div className="hidden md:block overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {/* FIX: Added a new header for the image column */}
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Image
          </th>
          {["title", "description", "mediaType", "createdAt"].map((key) => (
            <th
              key={key}
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort(key as keyof Gallery)}
            >
              <div className="flex items-center gap-1">
                {key === "createdAt" ? "Date Created" : key}
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
        {gallery.map((item) => (
          <GalleryTableRow
            key={item.id}
            item={item}
            onDelete={onDelete}
            isDeleting={isDeleting && deletingId === item.id}
          />
        ))}
      </tbody>
    </table>
  </div>
)

// --- GalleryTableRow ---
interface GalleryTableRowProps {
  item: Gallery
  onDelete: (id: number) => void
  isDeleting: boolean
}
const GalleryTableRow: React.FC<GalleryTableRowProps> = ({
  item,
  onDelete,
  isDeleting,
}) => (
  <tr className="hover:bg-gray-50 transition-colors">
    {/* FIX: Added a new cell to display the image */}
    <td className="px-6 py-4 whitespace-nowrap">
      <img
        className="h-12 w-12 rounded-md object-cover"
        src={item.mediaUrl}
        alt={item.title}
        onError={(e) => {
          e.currentTarget.src =
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
        }}
      />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{item.title}</div>
    </td>
    <td className="px-6 py-4">
      <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
        {item.description}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
        {item.mediaType}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {new Date(item.createdAt).toLocaleDateString()}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <Link
        to={paths.dashboard.gallery.edit(item.id.toString())}
        className="text-blue-600 cursor-pointer hover:text-blue-900 mr-4"
      >
        Edit
      </Link>
      <button
        className="text-red-600 hover:text-red-900 cursor-pointer disabled:opacity-50"
        onClick={() => onDelete(item.id)}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </td>
  </tr>
)

// --- GalleryCardList ---
interface GalleryCardListProps {
  gallery: Gallery[]
  onDelete: (id: number) => void
  isDeleting: boolean
  deletingId: number | null
}
const GalleryCardList: React.FC<GalleryCardListProps> = ({
  gallery,
  onDelete,
  isDeleting,
  deletingId,
}) => (
  <div className="md:hidden grid grid-cols-1 gap-4 p-4">
    {gallery.map((item) => (
      <div
        key={item.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <img
                className="h-16 w-16 rounded-lg object-cover border"
                src={item.mediaUrl}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                }}
              />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.title}
                </h3>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    onClick={() => onDelete(item.id)}
                    disabled={isDeleting && deletingId === item.id}
                  >
                    {isDeleting && deletingId === item.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600">
            <div className="flex items-center">
              <FiImage className="mr-1.5 h-3 w-3 text-blue-500" />
              <span className="capitalize">{item.mediaType}</span>
            </div>

            <div className="flex items-center">
              <FiCalendar className="mr-1.5 h-3 w-3 text-green-500" />
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

// --- GalleryPaginationControls ---
interface GalleryPaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
  totalItems: number
}
const GalleryPaginationControls: React.FC<GalleryPaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
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
      <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
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
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
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
              <span className="sr-only">Next</span>
              <FiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

// --- GalleryDeleteConfirmationModal ---
interface GalleryDeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}
const GalleryDeleteConfirmationModal: React.FC<
  GalleryDeleteConfirmationModalProps
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
                      Are you sure you want to delete this gallery item? This
                      action cannot be undone.
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
