import React, { useEffect, useMemo, useState } from "react"
import {
  FiAlertTriangle,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiFilter,
  FiMail,
  FiPhone,
  FiSearch,
} from "react-icons/fi"
import { Link } from "react-router"
import { paths } from "../../../../routes/paths"
import { useDeleteStaffMutation } from "../../../../store/admin"
import type { Staff } from "../../../../types/staff"
import { useAllStaff } from "../hooks/use-all-staff"

// ============================================================================
// Type Definitions
// ============================================================================

type SortConfig = { key: keyof Staff; direction: string }
type FiltersState = {
  role: string
  createdAt: string
}

// ============================================================================
// Main Component: StaffListView
// ============================================================================

export const StaffListView: React.FC = () => {
  // --- Hooks ---
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation()
  const { allStaff, isLoading, error } = useAllStaff()

  // --- State ---
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FiltersState>({
    role: "",
    createdAt: "",
  })
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<number | null>(null)

  // --- Handlers ---
  const handleOpenDeleteModal = (staffId: number) => {
    setStaffToDelete(staffId)
    setIsDeleteModalOpen(true)
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setStaffToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (staffToDelete !== null) {
      try {
        await deleteStaff(staffToDelete).unwrap()
        handleCancelDelete()
      } catch (err) {
        console.error("Failed to delete staff:", err)
      }
    }
  }

  const handleSort = (key: keyof Staff) => {
    let direction = "ascending"
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const resetFilters = () => {
    setFilters({ role: "", createdAt: "" })
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
  const filteredStaff = useMemo(() => {
    if (!allStaff) return []
    let result = [...allStaff]

    // Search logic
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (staff) =>
          staff.fullName.toLowerCase().includes(term) ||
          staff.email.toLowerCase().includes(term) ||
          staff.phoneNumber.toLowerCase().includes(term) ||
          staff.role.toLowerCase().includes(term)
      )
    }

    // Filter logic
    if (filters.role)
      result = result.filter((staff) => staff.role === filters.role)
    if (filters.createdAt)
      result = result.filter(
        (staff) => staff.createdAt.split("T")[0] === filters.createdAt
      )

    // Sorting logic
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]

        if (valA === null || valA === undefined) return 1
        if (valB === null || valB === undefined) return -1

        if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1
        if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1
        return 0
      })
    }

    return result
  }, [allStaff, searchTerm, filters, sortConfig])

  const roles = useMemo(() => {
    if (!allStaff) return []
    return [...new Set(allStaff.map((staff) => staff.role))]
  }, [allStaff])

  const totalItems = filteredStaff.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = filteredStaff.slice(startIndex, endIndex)

  // --- Effects ---
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters, sortConfig, itemsPerPage])

  // --- Render Logic ---
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <StaffListHeader
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
        roles={roles}
        onResetFilters={resetFilters}
      />

      {totalItems > 0 ? (
        <>
          <StaffListSummary
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
          <StaffTable
            staffMembers={currentItems}
            onSort={handleSort}
            sortConfig={sortConfig}
            onDelete={handleOpenDeleteModal}
            isDeleting={isDeleting}
            deletingId={staffToDelete}
          />
          <StaffCardList
            staffMembers={currentItems}
            onDelete={handleOpenDeleteModal}
            isDeleting={isDeleting}
            deletingId={staffToDelete}
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

// ============================================================================
// Subcomponents
// ============================================================================

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <h1>Loading...</h1>
  </div>
)

const ErrorState: React.FC<{ error: any }> = ({ error }) => (
  <div className="bg-red-50 rounded-xl p-6 text-center">
    <h3 className="text-red-800 font-medium">Error loading staff</h3>
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
      No staff members found matching your criteria.
    </div>
    <button
      onClick={onResetFilters}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      Reset Filters
    </button>
  </div>
)

// --- StaffListHeader ---
interface StaffListHeaderProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showFilters: boolean
  onToggleFilters: () => void
  onResetFilters: () => void
}

const StaffListHeader: React.FC<StaffListHeaderProps> = ({
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
          placeholder="Search staff..."
          value={searchTerm}
          onChange={onSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"
        >
          <FiFilter /> Filters{" "}
          {showFilters ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg"
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
  roles: string[]
  onResetFilters: () => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  filters,
  onFilterChange,
  roles,
  onResetFilters,
}) => {
  if (!isOpen) return null

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange("role", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Created Date
          </label>
          <input
            type="date"
            value={filters.createdAt}
            onChange={(e) => onFilterChange("createdAt", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onResetFilters}
            className="w-full py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

// --- StaffListSummary ---
const StaffListSummary: React.FC<{
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
      <span className="font-medium">{totalItems}</span> staff members
    </div>
    <div className="flex items-center gap-2">
      <span className="text-gray-700">Items per page:</span>
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

// --- StaffTable ---
const StaffTable: React.FC<{
  staffMembers: Staff[]
  onSort: (key: keyof Staff) => void
  sortConfig: SortConfig | null
  onDelete: (id: number) => void
  isDeleting: boolean
  deletingId: number | null
}> = ({
  staffMembers,
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
          {["fullName", "role", "email", "phoneNumber", "createdAt"].map(
            (key) => (
              <th
                key={key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort(key as keyof Staff)}
              >
                <div className="flex items-center gap-1">
                  {key === "createdAt" ? "Created" : key.replace("Number", "")}
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
        {staffMembers.map((staff) => (
          <StaffTableRow
            key={staff.id}
            staff={staff}
            onDelete={onDelete}
            isDeleting={isDeleting && deletingId === staff.id}
          />
        ))}
      </tbody>
    </table>
  </div>
)

// --- StaffTableRow ---
const StaffTableRow: React.FC<{
  staff: Staff
  onDelete: (id: number) => void
  isDeleting: boolean
}> = ({ staff, onDelete, isDeleting }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <img
          className="h-10 w-10 rounded-full object-cover border"
          src={
            `http://api.sevseadivers.com${staff.profilePicture}` ||
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
          }
          alt={""}
        />
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {staff.fullName}
          </div>
          <div className="text-sm text-gray-500">@{staff.username}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
        {staff.role}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div className="flex items-center">
        <FiMail className="mr-1.5 h-4 w-4 text-blue-500" />
        {staff.email}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div className="flex items-center">
        <FiPhone className="mr-1.5 h-4 w-4 text-green-500" />
        {staff.phoneNumber}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div className="flex items-center">
        <FiCalendar className="mr-1.5 h-4 w-4 text-purple-500" />
        {new Date(staff.createdAt).toLocaleDateString()}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <Link
        to={paths.dashboard.staff.edit(staff.id.toString())}
        className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
      >
        Edit
      </Link>
      <button
        onClick={() => onDelete(staff.id)}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-900 disabled:text-gray-400 cursor-pointer"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </td>
  </tr>
)

// --- StaffCardList ---
const StaffCardList: React.FC<{
  staffMembers: Staff[]
  onDelete: (id: number) => void
  isDeleting: boolean
  deletingId: number | null
}> = ({ staffMembers, onDelete, isDeleting, deletingId }) => (
  <div className="md:hidden grid grid-cols-1 gap-4 p-4">
    {staffMembers.map((staff) => (
      <StaffCard
        key={staff.id}
        staff={staff}
        onDelete={onDelete}
        isDeleting={isDeleting && deletingId === staff.id}
      />
    ))}
  </div>
)

// --- StaffCard ---
const StaffCard: React.FC<{
  staff: Staff
  onDelete: (id: number) => void
  isDeleting: boolean
}> = ({ staff, onDelete, isDeleting }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-4">
      <div className="flex items-start">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={staff.profilePicture || "/default-avatar.png"}
          alt={staff.fullName}
        />
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {staff.fullName}
              </h3>
              <p className="text-xs text-gray-500">@{staff.username}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={paths.dashboard.staff.edit(staff.id.toString())}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(staff.id)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 text-sm disabled:text-gray-400 cursor-pointer"
              >
                {isDeleting ? "..." : "Delete"}
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600">
            <div className="flex items-center">
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 mr-2">
                {staff.role}
              </span>
              <FiCalendar className="mr-1.5 h-3 w-3 text-purple-500" />
              <span>{new Date(staff.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center">
              <FiMail className="mr-1.5 h-3 w-3 text-blue-500" />
              <span className="truncate">{staff.email}</span>
            </div>

            <div className="flex items-center">
              <FiPhone className="mr-1.5 h-3 w-3 text-green-500" />
              <span>{staff.phoneNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// --- PaginationControls --- (Reuse from TripListView)
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

// --- DeleteConfirmationModal --- (Reuse from TripListView)
const DeleteConfirmationModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}> = ({ isOpen, onClose, onConfirm, isDeleting }) => {
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
                    Delete Staff Member
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure? This action cannot be undone.
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
                className="inline-flex cursor-pointer w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="mt-3 inline-flex cursor-pointer w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
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
