const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserbyId,
  updateUser,
  deleteSingleUser,
} = require("../controllers/userController");
const isLoggedIn  = require("../middleware/isLoggedIn");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isLoggedIn, getMe);
router.get("/", isLoggedIn, getAllUsers); // Can unprotect if needed
router.get("/:id", isLoggedIn, getUserbyId); // Can unprotect if needed
router.put("/:id", isLoggedIn, updateUser);
router.delete("/:id", isLoggedIn, deleteSingleUser);

module.exports = router;
