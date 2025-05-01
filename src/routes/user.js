const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController");
const isLoggedIn  = require("../middleware/isLoggedIn");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isLoggedIn, getMe);

module.exports = router;
