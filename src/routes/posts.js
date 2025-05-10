const express = require("express");
const router = express.Router();

const { addPost } = require("../controllers/postController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/posts", isLoggedIn, addPost);

module.exports = router;