import { Sequelize } from "sequelize"
import dotenv from "dotenv"
import config from "../config/config.js"

import defineUser from "./User.js"
import defineCourse from "./Course.js"
import defineBooking from "./Booking.js"
import defineService from "./Service.js"
import defineTrip from "./Trip.js"
import defineGallery from "./Gallery.js"
import defineEnrollment from "./Enrollment.js"
import defineRental from "./Rental.js"
import defineRentalBooking from "./RentalBooking.js"

dotenv.config({ path: "./config/.env" })

const env = process.env.NODE_ENV || "development"
const dbConfig = config[env]

const sequelize = dbConfig.use_env_variable
  ? new Sequelize(process.env[dbConfig.use_env_variable], {
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: Number(dbConfig.port),
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })

// Models...
const User = defineUser(sequelize)
const Course = defineCourse(sequelize)
const Booking = defineBooking(sequelize)
const Service = defineService(sequelize)
const Trip = defineTrip(sequelize)
const Gallery = defineGallery(sequelize)
const Enrollment = defineEnrollment(sequelize)
const Rental = defineRental(sequelize)
const RentalBooking = defineRentalBooking(sequelize)

// Associations...
Booking.belongsTo(User, { foreignKey: "userId" })
Booking.belongsTo(Course, { foreignKey: "courseId" })
Booking.belongsTo(Trip, { foreignKey: "tripId" })
Trip.hasMany(Booking, { foreignKey: "tripId" })
User.hasMany(Booking, { foreignKey: "userId" })
Course.hasMany(Booking, { foreignKey: "courseId" })

// Rental.belongsTo(User, { foreignKey: "userId" })
Rental.hasMany(RentalBooking, { foreignKey: "rentalId" })
RentalBooking.belongsTo(Rental, { foreignKey: "rentalId" })
User.hasMany(RentalBooking, { foreignKey: "userId" })
RentalBooking.belongsTo(User, { foreignKey: "userId" })

Gallery.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });
User.hasMany(Gallery, { foreignKey: 'uploadedBy', as: 'galleryItems' });

// A Course belongs to a User as 'staff'
  Course.belongsTo(User, {
  foreignKey: 'staffUserId',
  as: 'staff', 
});

User.hasMany(Course, {
  foreignKey: 'staffUserId',
  as: 'assignedCourses', // or any name
});



export {
  sequelize,
  User,
  Course,
  Booking,
  Service,
  Trip,
  Gallery,
  Enrollment,
  Rental,
  RentalBooking,
}
export default sequelize
