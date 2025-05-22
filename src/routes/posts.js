const express = require("express");
const router = express.Router();

const { 
    addPost, 
    getAllPosts,
    softDeleteOwnPost,
    adminDeletePost,
    updatePost,
    votePost,
 } = require("../controllers/postController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.get("/", getAllPosts);
router.post("/", isLoggedIn, addPost);
router.patch("/:postId/soft-delete", isLoggedIn, softDeleteOwnPost);
router.patch("/:postId", isLoggedIn, updatePost); 
router.post("/:postId/vote", isLoggedIn, votePost); 
router.delete("/:postId", isLoggedIn, isAdmin, adminDeletePost);
module.exports = router;