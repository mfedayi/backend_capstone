const express = require("express");
const router = express.Router();

const { 
    addPost, 
    getAllPosts,
    softDeleteOwnPost,
    adminDeletePost,
    updatePost,
    votePost,
    getUserPosts,
 } = require("../controllers/postController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.get("/", getAllPosts);
router.post("/", isLoggedIn, addPost);
router.patch("/:postId/soft-delete", isLoggedIn, softDeleteOwnPost);
router.patch("/:postId", isLoggedIn, updatePost); 
router.post("/:postId/vote", isLoggedIn, votePost);
router.delete("/:postId", isLoggedIn, isAdmin, adminDeletePost);
router.get("/user/:userId", getUserPosts); // New route to get posts by user ID

module.exports = router;