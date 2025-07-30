import dotenv from 'dotenv';
dotenv.config();

const common = {
  dialect: 'postgres',
  logging: false,
  use_env_variable: 'DB_URL', // <- Important
};

export default {
  development: { ...common },
  production: { ...common },
};
