const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Token Received:", token); // Add this line for debugging
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "khalil"); // Ensure this matches the key used for token generation
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    console.error("Token Error:", error.message); // Add this line for debugging
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
