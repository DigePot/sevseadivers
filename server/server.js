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
<<<<<<< HEAD
app.use(
  cors({
    origin: ["https://www.sevseadivers.com", "http://localhost:5173"],
=======
// app.use(cors())
// ✅ CORS should come **before everything else**
app.use(
  cors({
    origin: "https://www.sevseadivers.com",
>>>>>>> b8ee2abcd2348429b4c64c04c7fb14dbcd77c4cd
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

<<<<<<< HEAD
app.use(express.json({ limit: "4000mb" }))
app.use(express.urlencoded({ extended: true, limit: "4000mb" }))
=======
app.use(express.json({ limit: "4000mb" })) // also raise the limit to avoid next error
app.use(express.urlencoded({ extended: true, limit: "50mb" })) // for form uploads
>>>>>>> b8ee2abcd2348429b4c64c04c7fb14dbcd77c4cd

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
