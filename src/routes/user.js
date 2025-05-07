const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserbyId,
  updateUser,
<<<<<<< HEAD
  deleteSingleUser,
=======
  deleteSingleUser
>>>>>>> 4327eed08a990495afbc925d6698a88756fe42db
} = require("../controllers/userController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isLoggedIn, getMe);
<<<<<<< HEAD
router.get("/", isLoggedIn, getAllUsers);
router
  .route("/:id")
  .get(isLoggedIn, getUserbyId)
  .put(isLoggedIn, updateUser) // Handles full updates
  .patch(isLoggedIn, updateUser) // Add PATCH handler, potentially using the same controller
  .delete(isLoggedIn, deleteSingleUser);
=======
router.get("/", isLoggedIn, getAllUsers); // Can unprotect if needed
router.get("/:id", isLoggedIn, getUserbyId); // Can unprotect if needed
router.put("/:id", isLoggedIn, updateUser); // Can unprotect if needed
router.delete("/:id", isLoggedIn, deleteSingleUser); // Can unprotect if needed
>>>>>>> 4327eed08a990495afbc925d6698a88756fe42db

module.exports = router;
