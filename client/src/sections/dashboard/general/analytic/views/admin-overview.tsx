import React from "react"
import {
  FiBarChart2,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi"
import { useAdminAnalytic } from "../hooks/use-admin-analytic"
import type { AdminAnalytics } from "../../../../../types/admin-analytic"
import Spinner from "../../../../../components/Spinner"

export const AdminAnalyticView: React.FC = () => {
  const { adminAnalytics, error, isLoading } = useAdminAnalytic()

  if (isLoading) {
    return <Spinner />
  }

  if (error || !adminAnalytics) {
    const errorMessage =
      (error as any)?.data?.message ||
      (error as any)?.message ||
      "Failed to load analytics data"

    return (
      <div className="bg-red-50 rounded-xl p-6 text-center">
        <h3 className="text-red-800 font-medium">Error loading analytics</h3>
        <p className="text-red-600 mt-2">{errorMessage}</p>
      </div>
    )
  }

  // Convert all string counts to numbers
  // Convert all string counts to numbers and ensure they're numbers throughout
  const convertedAnalytics = {
    ...adminAnalytics,
    bookingsByPeriod: adminAnalytics.bookingsByPeriod.map((item) => ({
      ...item,
      count: Number(item.count) || 0, // Convert count to a number explicitly
    })),
    usersByPeriod: adminAnalytics.usersByPeriod.map((item) => ({
      ...item,
      count: Number(item.count) || 0, // Convert count to a number explicitly
    })),
    topCourses: adminAnalytics.topCourses.map((item) => ({
      ...item,
      bookingCount: Number(item.bookingCount) || 0, // Convert bookingCount to a number explicitly
      Course: item.Course || {
        title: "Unknown Course",
        price: 0,
      },
    })),
    userRoles: adminAnalytics.userRoles.map((item) => ({
      ...item,
      count: Number(item.count) || 0, // Convert count to a number explicitly
    })),
  }

  const {
    period,
    bookingsByPeriod,
    usersByPeriod,
    revenue,
    topCourses,
    userRoles,
  } = convertedAnalytics

  // Format date without external library
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return (
      date?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) || ""
    )
  }

  // Get period label
  const periodLabel =
    period === "month" ? "Monthly" : period === "week" ? "Weekly" : "Daily"

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Analytics Dashboard
        </h1>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {periodLabel} Overview
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold mt-2">
                ${revenue?.total?.toFixed(2) || "0.00"}
              </p>
              <p className="text-blue-200 mt-1">All-time earnings</p>
            </div>
            <div className="bg-blue-400/20 p-3 rounded-full">
              <FiDollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400/30 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2" />
            <span>
              Average: ${revenue?.average?.toFixed(2) || "0.00"} per booking
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Bookings</h3>
                <p className="text-xl font-bold mt-1">
                  {bookingsByPeriod.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                <FiUser className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">New Users</h3>
                <p className="text-xl font-bold mt-1">
                  {usersByPeriod.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg mr-3">
                <FiShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Top Courses</h3>
                <p className="text-xl font-bold mt-1">{topCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">
                <FiBarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">User Roles</h3>
                <p className="text-xl font-bold mt-1">
                  {userRoles.reduce((sum, role) => sum + role.count, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Bookings Over Time
            </h3>
            <span className="text-sm text-gray-500">{periodLabel}</span>
          </div>
          <BookingsChart data={bookingsByPeriod} formatDate={formatDate} />
        </div>

        {/* Users Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              New Users Over Time
            </h3>
            <span className="text-sm text-gray-500">{periodLabel}</span>
          </div>
          <UsersChart data={usersByPeriod} formatDate={formatDate} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Courses */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Top Performing Courses
            </h3>
            <span className="text-sm text-gray-500">By bookings</span>
          </div>
          <TopCoursesList courses={topCourses} />
        </div>

        {/* User Roles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              User Roles Distribution
            </h3>
            <span className="text-sm text-gray-500">Platform roles</span>
          </div>
          <UserRolesChart roles={userRoles} />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Subcomponents
// ============================================================================

type ChartProps = {
  data: Array<{ date: string; count: number }>
  formatDate: (dateString: string) => string
}

const BookingsChart: React.FC<ChartProps> = ({ data, formatDate }) => {
  if (!data?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No booking data available
      </div>
    )
  }

  // Find max value for scaling
  const maxValue = Math.max(...data.map((item) => item.count), 1)

  return (
    <div className="space-y-4">
      <div className="flex items-end h-48 gap-2 pt-8 border-b border-gray-200">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
              style={{ height: `${(item.count / maxValue) * 90}%` }}
            ></div>
            <div className="text-xs text-gray-500 mt-2">
              {formatDate(item.date)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Start</span>
        <span>End</span>
      </div>
    </div>
  )
}

const UsersChart: React.FC<ChartProps> = ({ data, formatDate }) => {
  if (!data?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No user data available
      </div>
    )
  }

  // Find max value for scaling
  const maxValue = Math.max(...data.map((item) => item.count), 1)

  return (
    <div className="space-y-4">
      <div className="flex items-end h-48 gap-2 pt-8 border-b border-gray-200">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
              style={{ height: `${(item.count / maxValue) * 90}%` }}
            ></div>
            <div className="text-xs text-gray-500 mt-2">
              {formatDate(item.date)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Start</span>
        <span>End</span>
      </div>
    </div>
  )
}

type TopCoursesListProps = {
  courses: AdminAnalytics["topCourses"]
}

const TopCoursesList: React.FC<TopCoursesListProps> = ({ courses }) => {
  if (!courses?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No course data available
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
              Course
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Bookings
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Revenue
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map((course, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {course.Course?.title || "Unknown Course"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {course.bookingCount}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${course.Course?.price?.toFixed(2) || "0.00"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-green-600">
                  $
                  {(course.bookingCount * (course.Course?.price || 0)).toFixed(
                    2
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type UserRolesChartProps = {
  roles: AdminAnalytics["userRoles"]
}

const UserRolesChart: React.FC<UserRolesChartProps> = ({ roles }) => {
  if (!roles?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No role data available
      </div>
    )
  }

  // Calculate total for percentages
  const total = roles.reduce((sum, role) => sum + role.count, 0)
  const colors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  // Precompute segments
  const segments = []
  let startAngle = 0

  for (const [index, role] of roles.entries()) {
    const percentage = (role.count / total) * 100
    if (percentage > 0) {
      const endAngle = startAngle + (percentage * 360) / 100
      const path = describeArc(50, 50, 40, startAngle, endAngle)
      segments.push({ path, color: colors[index % colors.length] })
      startAngle = endAngle
    }
  }

  return (
    <div className="space-y-4">
      {/* Pie chart visualization */}
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-white font-bold">{total}</div>
            <div className="text-white font-bold text-sm">Total Users</div>
          </div>
        </div>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => (
            <path key={index} d={segment.path} fill={segment.color} />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-6">
        {roles.map((role, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium capitalize">
                  {role.role}
                </span>
                <span className="text-sm text-gray-500">
                  {role.count} users
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: colors[index % colors.length],
                    width: `${(role.count / total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to create pie chart segments
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  return [
    "M",
    x,
    y,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
  ].join(" ")
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}
