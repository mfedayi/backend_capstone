const isAdmin = (req, res, next) => {
  // Middleware to check if the authenticated user is an admin.
  try {
    if (req.user?.isAdmin === true) {
      return next(); 
    } else {
      return res.status(403).json({ error: "Admin access required." });
    }
    
  } catch (error) {
    return res.status(500).json({ error: "Authorization error." });
  }
};

module.exports = isAdmin;
