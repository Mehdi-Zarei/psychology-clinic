module.exports = {
  server: {
    port: process.env.SERVER_PORT,
  },

  db: {
    mongoUri: process.env.DB_URI,
    redisUri: process.env.REDIS_URI,
  },

  auth: {
    jwtAccessTokenSecret: process.env.JWT_SECRET_ACCESS_TOKEN,

    jwtRefreshTokenSecret: process.env.JWT_SECRET_REFRESH_TOKEN,

    jwtAccessTokenExpire: process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES,

    jwtRefreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
  },

  zarinpal: {
    merchantID: process.env.ZARINPAL_MERCHANT_ID,

    apiBaseUrl: process.env.ZARINPAL_API_BASE_URL,

    paymentBaseUrl: process.env.ZARINPAL_PAYMENT_BASE_URL,

    paymentCallbackUrl: process.env.ZARINPAL_PAYMENT_CALLBACK_URL,
  },

  otp: {
    pattern: process.env.OTP_PATTERN,
    user: process.env.OTP_USER,
    pass: process.env.OTP_PASS,
  },

  domain: process.env.DOMAIN,

  apiVersion: process.env.API_VERSION,
};
