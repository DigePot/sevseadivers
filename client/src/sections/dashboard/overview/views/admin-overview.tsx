import React from "react"
import {
  FiActivity,
  FiCalendar,
  FiGrid,
  FiImage,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi"
import type { DashboardStats } from "../../../../types/dashboard-stats"
import { useDashboardStats } from "../hooks/use-dashboard-stats"

export const DashboardOverviewView: React.FC = () => {
  const { dashboardStats, error, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !dashboardStats) {
    // Safely extract error message
    const errorMessage =
      (error as any)?.data?.message ||
      (error as any)?.message ||
      "Please try again later"

    return (
      <div className="bg-red-50 rounded-xl p-6 text-center">
        <h3 className="text-red-800 font-medium">
          Error loading dashboard data
        </h3>
        <p className="text-red-600 mt-2">{errorMessage}</p>
      </div>
    )
  }

  const { overview, growth, recent } = dashboardStats

  // Format date without date-fns
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Overview Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Platform Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Users"
            value={overview.totalUsers}
            icon={<FiUsers className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Total Bookings"
            value={overview.totalBookings}
            icon={<FiCalendar className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            title="Total Courses"
            value={overview.totalCourses}
            icon={<FiGrid className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            title="Total Services"
            value={overview.totalServices}
            icon={<FiShoppingBag className="w-5 h-5" />}
            color="yellow"
          />
          <StatCard
            title="Total Trips"
            value={overview.totalTrips}
            icon={<FiActivity className="w-5 h-5" />}
            color="red"
          />
          <StatCard
            title="Gallery Items"
            value={overview.totalGalleryItems}
            icon={<FiImage className="w-5 h-5" />}
            color="indigo"
          />
        </div>
      </div>

      {/* Section 2: Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GrowthCard
            current={growth.currentMonthBookings}
            previous={growth.lastMonthBookings}
            growth={growth.bookingGrowth}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Bookings
              </h3>
              <div className="text-sm text-gray-500">
                {recent.bookings.length} bookings
              </div>
            </div>
            <RecentBookingsTable
              bookings={recent.bookings}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Recent Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
          <div className="text-sm text-gray-500">
            {recent.users.length} users
          </div>
        </div>
        <RecentUsersTable users={recent.users} formatDate={formatDate} />
      </div>
    </div>
  )
}

// ============================================================================
// Subcomponents
// ============================================================================

type StatCardProps = {
  title: string
  value: number
  icon: React.ReactNode
  color: "blue" | "green" | "purple" | "yellow" | "red" | "indigo"
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600",
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

type GrowthCardProps = {
  current: number
  previous: number
  growth: string
}

const GrowthCard: React.FC<GrowthCardProps> = ({
  current,
  previous,
  growth,
}) => {
  const isPositive = !growth.includes("-") && growth !== "0%"
  const changeText =
    previous === 0
      ? "No previous data"
      : `${isPositive ? "+" : ""}${growth} from last month`

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Booking Growth</h3>
        <FiTrendingUp
          className={`w-5 h-5 ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        />
      </div>

      <div className="mb-2">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">{current}</span>
          <span className="text-gray-500 ml-2">this month</span>
        </div>
        <div className="text-gray-500 text-sm mt-1">{previous} last month</div>
      </div>

      <div
        className={`flex items-center text-sm ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        <span>{changeText}</span>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-gray-500 text-sm mb-1">
          <span>Last Month</span>
          <span>This Month</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              isPositive ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              width: `${
                previous === 0 ? 100 : Math.min(100, (current / previous) * 100)
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

type RecentBookingsTableProps = {
  bookings: DashboardStats["recent"]["bookings"]
  formatDate: (dateString: string) => string
}

const RecentBookingsTable: React.FC<RecentBookingsTableProps> = ({
  bookings,
  formatDate,
}) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent bookings found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              User
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Course
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {booking.User.fullName}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.User.username}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {booking.Course.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(booking.bookingDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type RecentUsersTableProps = {
  users: DashboardStats["recent"]["users"]
  formatDate: (dateString: string) => string
}

const RecentUsersTable: React.FC<RecentUsersTableProps> = ({
  users,
  formatDate,
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent users found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              User
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{user.username}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(user.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    booked: { text: "Booked", color: "bg-green-100 text-green-800" },
    confirmed: { text: "Confirmed", color: "bg-blue-100 text-blue-800" },
    pending: { text: "Pending", color: "bg-yellow-100 text-yellow-800" },
    cancelled: { text: "Cancelled", color: "bg-red-100 text-red-800" },
    completed: { text: "Completed", color: "bg-purple-100 text-purple-800" },
  }

  const config = statusConfig[
    status.toLowerCase() as keyof typeof statusConfig
  ] || { text: status, color: "bg-gray-100 text-gray-800" }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.text}
    </span>
  )
}

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const roleConfig = {
    admin: { text: "Admin", color: "bg-purple-100 text-purple-800" },
    staff: { text: "Staff", color: "bg-blue-100 text-blue-800" },
    user: { text: "User", color: "bg-green-100 text-green-800" },
    guest: { text: "Guest", color: "bg-gray-100 text-gray-800" },
  }

  const config = roleConfig[role.toLowerCase() as keyof typeof roleConfig] || {
    text: role,
    color: "bg-gray-100 text-gray-800",
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.text}
    </span>
  )
}
