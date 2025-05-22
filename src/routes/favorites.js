const express = require("express");
const router = express.Router();
const {
  getFavorites,
  addFavoriteTeam,
  removeFavoriteTeam,
  getUserPublicFavorites,
} = require("../controllers/favoritesController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, getFavorites);
router.post("/:teamId", isLoggedIn, addFavoriteTeam);
router.delete("/:teamId", isLoggedIn, removeFavoriteTeam);
router.get("/public/:userId", getUserPublicFavorites); 

module.exports = router;
