const express = require("express");
const router = express.Router();

const {
  getFavorites,
  addFavoriteTeam,
} = require("../controllers/favoritesController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, getFavorites);
router.post("/:teamId", isLoggedIn, addFavoriteTeam);

module.exports = router;
