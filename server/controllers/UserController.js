import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/index.js"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"
import crypto from "crypto"
import { sendEmail } from "../utils/email.js"

const saltRounds = 10
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret"

// Register user
export const register = tryCatch(async (req, res, next) => {
  const {
    username,
    password,
    confirmPassword,
    email,
    fullName,
    phoneNumber,
    role,
  } = req.body

  if (!username || !password || !confirmPassword || !email || !fullName) {
    return next(
      new AppError(
        "All fields (username, password, confirmPassword, email, fullName) are required",
        400
      )
    )
  }

  if (password !== confirmPassword) {
    return next(new AppError("Password and confirm password do not match", 400))
  }

  // Role validation
  const allowedRoles = ["staff", "admin", "client"]
  const assignedRole = role
  if (!allowedRoles.includes(assignedRole)) {
    return next(
      new AppError(
        `Invalid role "${assignedRole}". Must be one of: ${allowedRoles.join(
          ", "
        )}`,
        400
      )
    )
  }

  const existingUser = await User.findOne({ where: { username } })
  if (existingUser) {
    return next(new AppError("Username already exists", 409))
  }

  const existingEmail = await User.findOne({ where: { email } })
  if (existingEmail) {
    return next(new AppError("Email already exists", 409))
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    fullName,
    phoneNumber,
    // role: role || "client",
    role: assignedRole,
  })

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "1d" }
  )

  res.status(201).json({ user, token })
})

// Login user
export const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400))
  }

  const user = await User.findOne({ where: { email } })

  if (!user) {
    return next(new AppError("User not found", 404))
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return next(new AppError("Invalid credentials", 401))
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "1d" }
  )

  res.json({ user, token })
})

// Logout user
export const logout = tryCatch(async (req, res, next) => {
  res.clearCookie("token")
  res.json({ message: "Logged out successfully" })
})

// Get all users
export const getAllUsers = tryCatch(async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

// Get user by ID
export const getUserById = tryCatch(async (req, res, next) => {
  const user = await User.findByPk(req.params.id)

  if (!user) {
    return next(new AppError("User not found", 404))
  }

  // res.json(user);
  res.json(user.get()) // or user.toJSON()
})

// Update user
export const updateUser = tryCatch(async (req, res, next) => {
  console.log("req.body", req.body)
  const user = await User.findByPk(req.params.id)

  if (!user) {
    return next(new AppError("User not found", 404))
  }

  const { password, ...rest } = req.body

  // convert empty strings to null
  for (const key in rest) {
    if (rest[key] === "") {
      rest[key] = null
    }
  }

  if (password && password.trim() !== "") {
    rest.password = await bcrypt.hash(password, saltRounds)
  }

  await user.update(rest)

  const { password: _, ...updatedUser } = user.get({ plain: true })

  res.json(updatedUser)
})

// Delete user
export const deleteUser = tryCatch(async (req, res, next) => {
  const user = await User.findByPk(req.params.id)

  if (!user) {
    return next(new AppError("User not found", 404))
  }

  await user.destroy()

  res.json({ message: "User deleted" })
})

// Send OTP for verification
export const sendOtp = tryCatch(async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) return res.status(404).json({ message: "User not found" })
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 min
  user.otp = otp
  user.otpExpiry = otpExpiry
  await user.save()
  await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`)
  res.json({ message: "OTP sent to email" })
})

// Verify OTP
export const verifyOtp = tryCatch(async (req, res, next) => {
  const { email, otp } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user || !user.otp || !user.otpExpiry)
    return res.status(400).json({ message: "OTP not set" })
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" })
  if (user.otpExpiry < new Date())
    return res.status(400).json({ message: "OTP expired" })
  user.otp = null
  user.otpExpiry = null
  user.isVerified = true
  await user.save()
  res.json({ message: "OTP verified" })
})

// Forgot Password (send OTP for reset)
export const forgotPassword = tryCatch(async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) return res.status(404).json({ message: "User not found" })
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 min
  user.otp = otp
  user.otpExpiry = otpExpiry
  await user.save()
  await sendEmail(
    email,
    "Password Reset OTP",
    `Your password reset OTP is: ${otp}`
  )
  res.json({ message: "Password reset OTP sent to email" })
})

// Reset Password (with OTP)
export const resetPassword = tryCatch(async (req, res, next) => {
  const { email, otp, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user || !user.otp || !user.otpExpiry)
    return res.status(400).json({ message: "OTP not set" })
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" })
  if (user.otpExpiry < new Date())
    return res.status(400).json({ message: "OTP expired" })
  user.password = await bcrypt.hash(password, 10)
  user.otp = null
  user.otpExpiry = null
  await user.save()
  res.json({ message: "Password reset successful" })
})

export const getProfile = async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ user })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message })
  }
}
