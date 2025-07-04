import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import defineUser from './User.js';
import defineCourse from './Course.js'; // ✅ Corrected
import defineBooking from './Booking.js';
import defineService from './Service.js';
import defineTrip from './Trip.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: Number(dbConfig.port),
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

// Initialize models
const User = defineUser(sequelize);
const Course = defineCourse(sequelize); // ✅ Call the function!
const Booking = defineBooking(sequelize);
const Service = defineService(sequelize);
const Trip = defineTrip(sequelize);

// Associations
Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Course, { foreignKey: 'courseId' });
User.hasMany(Booking, { foreignKey: 'userId' });
Course.hasMany(Booking, { foreignKey: 'courseId' });

// Export models and sequelize instance
export { sequelize, User, Course, Booking, Service, Trip };
export default sequelize;
