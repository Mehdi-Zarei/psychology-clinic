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

    refreshTokenExpireTimeInRedis:
      process.env.REFRESH_TOKEN_EXPIRE_TIME_IN_REDIS,
  },

  zarinpal: {
    merchantID: process.env.ZARINPAL_MERCHANT_ID,

    apiBaseUrl: process.env.ZARINPAL_API_BASE_URL,

    paymentBaseUrl: process.env.ZARINPAL_PAYMENT_BASE_URL,

    paymentCallbackUrl: process.env.ZARINPAL_PAYMENT_CALLBACK_URL,
  },

  otp: {
    otpPattern: process.env.OTP_PATTERN,
    otpVariable: process.env.OTP_VARIABLE,

    feedbackPattern: process.env.FEEDBACK_LINK_PATTERN,
    feedbackVariable: process.env.FEEDBACK_LINK_VARIABLE,

    psychologistReminderPattern: process.env.PSYCHOLOGIST_REMINDER_PATTERN,
    psychologistReminderVariable: process.env.PSYCHOLOGIST_REMINDER_VARIABLE,

    user: process.env.OTP_USER,
    pass: process.env.OTP_PASS,
  },

  domain: process.env.DOMAIN,

  apiVersion: process.env.API_VERSION,
};
