import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import sequelize from "./models/index.js"
import userRouter from "./routes/userRoutes.js"
import courseRouter from "./routes/courseRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js"
import serviceRouter from "./routes/serviceRoutes.js"
import tripRouter from "./routes/tripRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import galleryRoutes from "./routes/GalleryRoutes.js"
import enrollmentRoutes from "./routes/enrollmentRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import staffRoutes from "./routes/staffRoutes.js"

import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

dotenv.config({ path: "./config/.env" })

const app = express()
// app.use(cors())
app.use(
  cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json())

// Get the current directory name (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Serve static files from the 'upload' directory
app.use("/upload", express.static(path.join(__dirname, "upload")))

// Routes
app.use("/api/users", userRouter)
app.use("/api/courses", courseRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/services", serviceRouter)
app.use("/api/trips", tripRouter)
app.use("/api/admin", adminRoutes)
app.use("/api/gallery", galleryRoutes)
app.use("/api/enrollments", enrollmentRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/staff", staffRoutes)

app.get("/", (req, res) => {
  res.send("✅ Server is running and connected to Sequelize")
})

// Sync DB and start server
const PORT = process.env.PORT || 5000

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced")
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ Database sync failed:", err)
  })
