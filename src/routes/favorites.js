const express = require("express");
const router = express.Router();

const {
  getFavorites,
  addFavoriteTeam,
} = require("../controllers/favoritesController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/favorites", isLoggedIn, getFavorites);
router.post("/favorites:teamId", isLoggedIn, addFavoriteTeam);
