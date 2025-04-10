const jwt = require("jsonwebtoken");
const envConfigs = require("../envConfigs");

const generateAccessToken = async (userID, userRole) => {
  try {
    return jwt.sign(
      { id: userID, role: userRole },
      envConfigs.auth.jwtAccessTokenSecret,
      {
        expiresIn: envConfigs.auth.jwtAccessTokenExpire,
      }
    );
  } catch (error) {
    throw error;
  }
};

const generateRefreshToken = async (userID) => {
  try {
    return jwt.sign({ id: userID }, envConfigs.auth.jwtRefreshTokenSecret, {
      expiresIn: envConfigs.auth.jwtRefreshTokenExpire,
    });
  } catch (error) {
    throw error;
  }
};

const decodeToken = async (token) => {
  try {
    return jwt.decode(token, envConfigs.auth.jwtAccessTokenSecret);
  } catch (error) {
    throw error;
  }
};

module.exports = { generateAccessToken, generateRefreshToken, decodeToken };
