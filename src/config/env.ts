const env = {
  ENV: process.env.ENV,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  HOST_URL: process.env.HOST_URL,
  WEB_URL: process.env.WEB_URL,
  SECRET: process.env.SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  TOKEN_LIFE: process.env.TOKEN_LIFE,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};

export default env;
