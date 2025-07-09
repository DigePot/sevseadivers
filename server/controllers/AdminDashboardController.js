import {
  User,
  Booking,
  Course,
  Service,
  Trip,
  Gallery,
  sequelize,
} from "../models/index.js"
import { Op } from "sequelize"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"
import bcrypt from "bcrypt"

const saltRounds = 10

// ==================== ANALYTICS & REPORTS ====================

// Get dashboard overview statistics
export const getDashboardStats = tryCatch(async (req, res) => {
  const [
    totalUsers,
    totalBookings,
    totalCourses,
    totalServices,
    totalTrips,
    totalGalleryItems,
    recentBookings,
    recentUsers,
  ] = await Promise.all([
    User.count(),
    Booking.count(),
    Course.count(),
    Service.count(),
    Trip.count(),
    Gallery.count(),
    Booking.findAll({
      include: [
        { model: User, attributes: ["username", "fullName"] },
        { model: Course, attributes: ["title"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    }),
    User.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "username", "fullName", "email", "role", "createdAt"],
    }),
  ])

  // Calculate monthly growth
  const currentMonth = new Date()
  const lastMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1,
    1
  )

  const [currentMonthBookings, lastMonthBookings] = await Promise.all([
    Booking.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
          ),
        },
      },
    }),
    Booking.count({
      where: {
        createdAt: {
          [Op.gte]: lastMonth,
          [Op.lt]: new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
          ),
        },
      },
    }),
  ])

  const bookingGrowth =
    lastMonthBookings > 0
      ? (
          ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) *
          100
        ).toFixed(2)
      : 0

  res.json({
    overview: {
      totalUsers,
      totalBookings,
      totalCourses,
      totalServices,
      totalTrips,
      totalGalleryItems,
    },
    growth: {
      currentMonthBookings,
      lastMonthBookings,
      bookingGrowth: `${bookingGrowth}%`,
    },
    recent: {
      bookings: recentBookings,
      users: recentUsers,
    },
  })
})

// Get detailed analytics
export const getAnalytics = tryCatch(async (req, res) => {
  const { period = "month" } = req.query

  let startDate, endDate
  const now = new Date()

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  }
  endDate = now

  const [
    bookingsByPeriod,
    usersByPeriod,
    revenueByPeriod,
    topCourses,
    userRoles,
  ] = await Promise.all([
    Booking.findAll({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
    }),
    User.findAll({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
    }),
    Booking.findAll({
      include: [{ model: Course, attributes: ["price"] }],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
      },
    }),
    Booking.findAll({
      include: [{ model: Course, attributes: ["title", "price"] }],
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("Booking.id")), "bookingCount"],
      ],
      group: ["Course.id"],
      order: [[sequelize.fn("COUNT", sequelize.col("Booking.id")), "DESC"]],
      limit: 5,
    }),
    User.findAll({
      attributes: [
        "role",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["role"],
    }),
  ])

  // Calculate revenue
  const totalRevenue = revenueByPeriod.reduce((sum, booking) => {
    return sum + (booking.Course?.price || 0)
  }, 0)

  res.json({
    period,
    bookingsByPeriod,
    usersByPeriod,
    revenue: {
      total: totalRevenue,
      average:
        revenueByPeriod.length > 0 ? totalRevenue / revenueByPeriod.length : 0,
    },
    topCourses,
    userRoles,
  })
})

// Generate comprehensive reports
export const generateReport = tryCatch(async (req, res) => {
  const { type, startDate, endDate } = req.query

  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().getFullYear(), 0, 1)
  const end = endDate ? new Date(endDate) : new Date()

  let report

  switch (type) {
    case "bookings":
      report = await Booking.findAll({
        include: [
          { model: User, attributes: ["username", "fullName", "email"] },
          { model: Course, attributes: ["title", "price"] },
        ],
        where: {
          createdAt: { [Op.between]: [start, end] },
        },
        order: [["createdAt", "DESC"]],
      })
      break

    case "users":
      report = await User.findAll({
        where: {
          createdAt: { [Op.between]: [start, end] },
        },
        attributes: {
          exclude: [
            "password",
            "otp",
            "otpExpiry",
            "resetPasswordToken",
            "resetPasswordExpiry",
          ],
        },
        order: [["createdAt", "DESC"]],
      })
      break

    case "revenue":
      const bookings = await Booking.findAll({
        include: [{ model: Course, attributes: ["title", "price"] }],
        where: {
          createdAt: { [Op.between]: [start, end] },
        },
      })

      const revenueByCourse = {}
      let totalRevenue = 0

      bookings.forEach((booking) => {
        const courseTitle = booking.Course?.title || "Unknown"
        const price = booking.Course?.price || 0

        if (!revenueByCourse[courseTitle]) {
          revenueByCourse[courseTitle] = { bookings: 0, revenue: 0 }
        }

        revenueByCourse[courseTitle].bookings++
        revenueByCourse[courseTitle].revenue += price
        totalRevenue += price
      })

      report = {
        totalRevenue,
        totalBookings: bookings.length,
        revenueByCourse,
        bookings,
      }
      break

    default:
      return next(
        new AppError(
          "Invalid report type. Use: bookings, users, or revenue",
          400
        )
      )
  }

  res.json({
    type,
    startDate: start,
    endDate: end,
    data: report,
  })
})

// ==================== STAFF MANAGEMENT ====================

// Get all staff members
export const getAllStaff = tryCatch(async (req, res) => {
  const staff = await User.findAll({
    where: {
      // role: { [Op.in]: ['admin', 'staff'] }
      role: { [Op.in]: ["staff"] },
    },
    attributes: {
      exclude: [
        "password",
        "otp",
        "otpExpiry",
        "resetPasswordToken",
        "resetPasswordExpiry",
      ],
    },
    order: [["createdAt", "DESC"]],
  })

  res.json(staff)
})

export const getStaffById = tryCatch(async (req, res, next) => {
  const staff = await User.findByPk(req.params.id)
  if (!staff) return next(new AppError("staff not found", 404))
  res.json(staff)
})

// Create new staff member
export const createStaff = tryCatch(async (req, res, next) => {
  const { username, password, email, fullName, phoneNumber, role } = req.body

  if (!username || !password || !email || !fullName || !role) {
    return next(
      new AppError(
        "Username, password, email, fullName, and role are required",
        400
      )
    )
  }

  if (!["admin", "staff"].includes(role)) {
    return next(new AppError('Role must be either "admin" or "staff"', 400))
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    where: { [Op.or]: [{ username }, { email }] },
  })

  if (existingUser) {
    return next(new AppError("Username or email already exists", 409))
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const staff = await User.create({
    username,
    password: hashedPassword,
    email,
    fullName,
    phoneNumber,
    role,
  })

  // Return user without password
  const { password: _, ...staffWithoutPassword } = staff.toJSON()

  res.status(201).json(staffWithoutPassword)
})

// Update staff member
export const updateStaff = tryCatch(async (req, res, next) => {
  const { id } = req.params
  const { username, email, fullName, phoneNumber, role } = req.body

  const staff = await User.findOne({
    where: { id, role: { [Op.in]: ["admin", "staff"] } },
  })

  if (!staff) {
    return next(new AppError("Staff member not found", 404))
  }

  if (role && !["admin", "staff"].includes(role)) {
    return next(new AppError('Role must be either "admin" or "staff"', 400))
  }

  // Check for conflicts
  if (username || email) {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          username ? { username } : null,
          email ? { email } : null,
        ].filter(Boolean),
        id: { [Op.ne]: id },
      },
    })

    if (existingUser) {
      return next(new AppError("Username or email already exists", 409))
    }
  }

  await staff.update({
    username: username || staff.username,
    email: email || staff.email,
    fullName: fullName || staff.fullName,
    phoneNumber: phoneNumber || staff.phoneNumber,
    role: role || staff.role,
  })

  const { password: _, ...staffWithoutPassword } = staff.toJSON()

  res.json(staffWithoutPassword)
})

// Delete staff member
export const deleteStaff = tryCatch(async (req, res, next) => {
  const { id } = req.params

  const staff = await User.findOne({
    where: { id, role: { [Op.in]: ["admin", "staff"] } },
  })

  if (!staff) {
    return next(new AppError("Staff member not found", 404))
  }

  // Prevent deleting the last admin
  if (staff.role === "admin") {
    const adminCount = await User.count({ where: { role: "admin" } })
    if (adminCount <= 1) {
      return next(new AppError("Cannot delete the last admin user", 400))
    }
  }

  await staff.destroy()

  res.json({ message: "Staff member deleted successfully" })
})

// Get staff performance metrics
export const getStaffPerformance = tryCatch(async (req, res) => {
  const { staffId } = req.params
  const { period = "month" } = req.query

  const staff = await User.findOne({
    where: { id: staffId, role: { [Op.in]: ["admin", "staff"] } },
  })

  if (!staff) {
    return next(new AppError("Staff member not found", 404))
  }

  // Get period dates
  const now = new Date()
  let startDate

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  }

  // Get activities (this would need to be expanded based on your specific needs)
  const activities = await Gallery.findAll({
    where: {
      uploadedBy: staffId,
      createdAt: { [Op.gte]: startDate },
    },
    order: [["createdAt", "DESC"]],
  })

  res.json({
    staff: {
      id: staff.id,
      username: staff.username,
      fullName: staff.fullName,
      role: staff.role,
      createdAt: staff.createdAt,
    },
    period,
    activities: {
      totalUploads: activities.length,
      recentUploads: activities.slice(0, 5),
    },
  })
})
