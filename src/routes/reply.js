const express = require("express");
const router = express.Router();

const { addReply, addFavoriteTeam } = require("../controllers/replyController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/favorites", isLoggedIn, addReply);
router.post("/posts/:postId/replies", isLoggedIn, addReply);
router.delete("/api/admin/posts/:postId", isLoggedIn, isAdmin, deletePost);
router.delete(
  "/api/admin/posts/:postId/replies/:replyId",
  isLoggedIn,
  isAdmin,
  deleteReply
);
//Route for user deleting his own replies and posts
