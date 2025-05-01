const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserbyId,
} = require("../controllers/userController");
const isLoggedIn  = require("../middleware/isLoggedIn");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isLoggedIn, getMe);
router.get("/", isLoggedIn, getAllUsers); // Can unprotect if needed
router.get("/:id", isLoggedIn, getUserbyId); // Can unprotect if needed

module.exports = router;
