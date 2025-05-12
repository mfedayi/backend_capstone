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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isLoggedIn, getMe);
router.get("/", isLoggedIn, getAllUsers);
router.patch("/me", isLoggedIn, updateMe);
router
  .route("/:id")
  .get(isLoggedIn, getUserbyId)
  .put(isLoggedIn, updateUser) // Handles full updates
  .patch(isLoggedIn, updateUser) // Add PATCH handler, potentially using the same controller
  .delete(isLoggedIn, deleteSingleUser);

module.exports = router;
