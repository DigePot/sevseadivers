require('dotenv').config({ path: './config/.env' });

module.exports = {
  development: {
    use_env_variable: 'DB_URL',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    use_env_variable: 'DB_URL',
    dialect: 'postgres',
    logging: false,
  },
};
