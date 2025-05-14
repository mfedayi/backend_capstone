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
} = require("../controllers/userController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isLoggedIn, getMe);
router.get("/", isLoggedIn, isAdmin,  getAllUsers);
router.patch("/me", isLoggedIn, updateMe);
router
  .route("/:id")
  .get(isLoggedIn, isAdmin, getUserbyId)
  .put(isLoggedIn, isAdmin, updateUser) // Handles full updates
  .patch(isLoggedIn, isAdmin, updateUser) // Add PATCH handler, potentially using the same controller
  .delete(isLoggedIn, isAdmin, deleteSingleUser);

module.exports = router;
