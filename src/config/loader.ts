import { ConfigInterface } from '.';

export default (): ConfigInterface => ({
  NODE_ENV: process.env.NODE_ENV,

  HOST: process.env.HOST,
  PORT: parseInt(process.env.PORT, 10),

  LANGUAGE: process.env.LANGUAGE,

  DB_BASE_URI: process.env.DB_BASE_URI,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_URI: process.env.DB_URI,
  DB_USER: process.env.DB_USER,

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_SECRET: process.env.JWT_SECRET,
});
