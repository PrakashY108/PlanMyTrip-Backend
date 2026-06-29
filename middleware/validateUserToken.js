import { decodeToken } from "../utils/decodeToken.js";

export const validateUserToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from authorization header

  if (!token) {
    return res.status(401).json({
      message: "Unauthenticated User",
      status: false,
    });
  }

  try {
    const user_id = await decodeToken(token); // Decode the token to get user_id
    req.body.user_id = user_id; // Set the user_id in the request body

    next(); // Pass control to the next middleware or handler
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      status: false,
    });
  }
};
