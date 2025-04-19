import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login to access this resource",
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check if user exists
    const user = await User.findById(decoded.userid);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only admin can access this resource",
        success: false,
      });
    }

    // Set user id for further use
    req.id = user._id;
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default isAdmin;
