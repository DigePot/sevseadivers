import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import defineUser from './User.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: Number(dbConfig.port), // ensure it's a number
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

// Initialize Models
const User = defineUser(sequelize);



// Export
export { sequelize, User };
export default sequelize;
