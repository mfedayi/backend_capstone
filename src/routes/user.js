const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserbyId,
  updateUser,
  updateMe,
  deleteSingleUser,
  getPublicUserProfile,
} = require("../controllers/userController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isLoggedIn, getMe);
router.get("/", isLoggedIn, isAdmin,  getAllUsers);
router.patch("/me", isLoggedIn, updateMe);
router.get("/public/:userId", getPublicUserProfile); // New route for public profile data
router
  .route("/:id")
  .get(isLoggedIn, getUserbyId)
  .put(isLoggedIn, isAdmin, updateUser) // Handles full updates
  .patch(isLoggedIn, isAdmin, updateUser) 
  .delete(isLoggedIn, isAdmin, deleteSingleUser);

module.exports = router;
