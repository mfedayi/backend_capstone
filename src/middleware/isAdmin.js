const isAdmin = (req, res, next) => {
  try {
    console.log("Decoded user from token:", req.user);
    
    if (req.user && req.user?.isAdmin === true) {
       
      return next(); // if user is admin then go to next stepp
    } else {
      return res.status(403).json({ error: "Admin access required." });
    }
    
  } catch (error) {
    return res.status(500).json({ error: "Authorization error." });
  }
};

module.exports = isAdmin;
