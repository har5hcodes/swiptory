const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const requireAuth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Unauthorized" });
  }
};

module.exports = requireAuth;
