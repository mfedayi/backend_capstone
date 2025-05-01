const SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(400).json({ error: "Invalid token. Bear is missing" });
    }
    const token = authHeader?.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, SECRET);
    req.user = decodedToken; //Attach payload to req.user
    next();
  } catch (err) {
    return res.status(400).json({ error: "Unauthorized or invalid user" });
  }
};

module.exports = isLoggedIn;
