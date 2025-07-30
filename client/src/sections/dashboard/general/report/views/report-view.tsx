import React, { useState } from "react"
import { useLazyGenerateReportQuery } from "../../../../../store/admin"
import { format, parseISO } from "date-fns"
import Spinner from "../../../../../components/Spinner"

interface ReportParams {
  type: string
  startDate: string
  endDate: string
}

export const ReportView: React.FC = () => {
  const [reportParams, setReportParams] = useState<ReportParams>({
    type: "bookings",
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  const [trigger, { data, error, isLoading, isFetching }] =
    useLazyGenerateReportQuery()

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setReportParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trigger(reportParams)
  }

  const renderReport = () => {
    if (!data || !data.data) return null

    switch (data.type) {
      case "bookings":
        return <BookingsReport data={data.data} />
      case "users":
        return <UsersReport data={data.data} />
      case "revenue":
        return <RevenueReport data={data.data} />
      default:
        return <p>Unsupported report type</p>
    }
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Reports Dashboard
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Report Type
          </label>
          <select
            name="type"
            value={reportParams.type}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="bookings">Bookings</option>
            <option value="users">Users</option>
            <option value="revenue">Revenue</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={reportParams.startDate}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={reportParams.endDate}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isFetching}
            className="w-full cursor-pointer bg-[#20c2f8] hover:bg-[#20c2f8]/90 text-[rgba(18, 23, 23, 1)] py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
          >
            {isFetching ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading report: {error.toString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading || isFetching ? (
        <Spinner />
      ) : (
        data && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {data.type} Report
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {format(parseISO(data.startDate), "MMM dd, yyyy")} -{" "}
                {format(parseISO(data.endDate), "MMM dd, yyyy")}
              </p>
            </div>
            {renderReport()}
          </div>
        )
      )}
    </div>
  )
}

// Booking Report Component
interface BookingData {
  id: string
  User?: {
    fullName?: string
    email?: string
  }
  Course?: {
    title?: string
    price?: number
  }
  createdAt: string
}

interface BookingsReportProps {
  data: BookingData[]
}

const BookingsReport: React.FC<BookingsReportProps> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            User
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Course
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.length > 0 ? (
          data.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">
                  {booking.User?.fullName || "N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.User?.email || "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking.Course?.title || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${booking.Course?.price?.toFixed(2) || "0.00"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(parseISO(booking.createdAt), "MMM dd, yyyy HH:mm")}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
              No bookings found in the selected date range
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

// Users Report Component
interface UserData {
  id: string
  fullName?: string
  username?: string
  email?: string
  createdAt: string
}

interface UsersReportProps {
  data: UserData[]
}

const UsersReport: React.FC<UsersReportProps> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Username
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Joined
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.length > 0 ? (
          data.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {user.fullName || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.username || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.email || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(parseISO(user.createdAt), "MMM dd, yyyy")}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
              No users found in the selected date range
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

// Revenue Report Component
interface RevenueStats {
  bookings: number
  revenue: number
}

interface RevenueData {
  totalRevenue: number
  totalBookings: number
  revenueByCourse: Record<string, RevenueStats>
  bookings: BookingData[]
}

interface RevenueReportProps {
  data: RevenueData
}

const RevenueReport: React.FC<RevenueReportProps> = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pt-4">
      <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
        <p className="text-sm font-medium text-blue-700">Total Revenue</p>
        <p className="text-2xl font-bold text-blue-900">
          ${data.totalRevenue.toFixed(2)}
        </p>
      </div>
      <div className="bg-green-50 rounded-lg p-4 shadow-sm">
        <p className="text-sm font-medium text-green-700">Total Bookings</p>
        <p className="text-2xl font-bold text-green-900">
          {data.totalBookings}
        </p>
      </div>
      <div className="bg-purple-50 rounded-lg p-4 shadow-sm">
        <p className="text-sm font-medium text-purple-700">Courses</p>
        <p className="text-2xl font-bold text-purple-900">
          {Object.keys(data.revenueByCourse).length}
        </p>
      </div>
    </div>

    <div className="px-6">
      <h3 className="text-md font-semibold text-gray-800 mb-3">
        Revenue by Course
      </h3>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bookings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(data.revenueByCourse).map(([course, stats]) => (
              <tr key={course} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats.bookings}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${stats.revenue.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="px-6 pb-4">
      <h3 className="text-md font-semibold text-gray-800 mb-3">
        Booking Details
      </h3>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.bookings.length > 0 ? (
              data.bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {booking.User?.fullName || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.User?.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.Course?.title || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${booking.Course?.price?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(booking.createdAt), "MMM dd, yyyy")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
