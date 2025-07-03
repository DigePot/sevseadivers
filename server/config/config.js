import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'postgres', 
  logging: false,       
};

export default {
  development: { ...common },
  production: { ...common },
};
