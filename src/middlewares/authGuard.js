const userModel = require("../model/User");
const { decodeToken } = require("../helper/jwtTokens");

const authGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "لطفا ابتدا وارد حساب کاربری خود شوید.",
      });
    }

    const decoded = await decodeToken(token);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = authGuard;
