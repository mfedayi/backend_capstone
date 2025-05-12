const express = require("express");
const router = express.Router();

const { addPost, getAllPosts } = require("../controllers/postController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", getAllPosts);
router.post("/", isLoggedIn, addPost);

module.exports = router;