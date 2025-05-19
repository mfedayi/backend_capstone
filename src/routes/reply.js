const express = require("express");
const router = express.Router();

const {
  addReply,
  softDeleteOwnReply,
  adminDeleteReply,
  updateReply,
} = require("../controllers/replyController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin")

router.post("/posts/:postId/replies", isLoggedIn, addReply);
router.patch("/:replyId/soft-delete", isLoggedIn, softDeleteOwnReply); // User deletes own reply
router.delete("/admin/:replyId", isLoggedIn, isAdmin, adminDeleteReply); // Admin deletes any reply
router.patch("/:replyId", isLoggedIn, updateReply); // New route for editing a reply
//Route for user deleting his own replies and posts

module.exports = router;