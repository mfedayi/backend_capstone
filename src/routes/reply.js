const express = require("express");
const router = express.Router();
// Handles routes related to replies on forum posts.

const {
  addReply,
  softDeleteOwnReply,
  adminDeleteReply,
  updateReply,
  voteReply,
} = require("../controllers/replyController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.post("/posts/:postId/replies", isLoggedIn, addReply);
router.patch("/:replyId/soft-delete", isLoggedIn, softDeleteOwnReply); 
router.delete("/admin/:replyId", isLoggedIn, isAdmin, adminDeleteReply); 
router.patch("/:replyId", isLoggedIn, updateReply);
router.post("/:replyId/vote", isLoggedIn, voteReply);

module.exports = router;
