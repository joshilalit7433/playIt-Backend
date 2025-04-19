import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not Authenticated",
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Set req.user to match what your controllers expect
    req.user = { _id: decode.userid }; // This fixes your controller's expectation
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error in authentication",
      success: false,
      error: error.message,
    });
  }
};

export default isAuthenticated;
