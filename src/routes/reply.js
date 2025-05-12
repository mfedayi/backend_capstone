const express = require("express");
const router = express.Router();

const { addReply } = require("../controllers/replyController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin")
// const { deletePost, deleteReply } = require("../controllers/someOtherController"); // These need to be defined

router.post("/posts/:postId/replies", isLoggedIn, addReply);
// router.delete("/api/admin/posts/:postId", isLoggedIn, isAdmin, deletePost);
// router.delete(
//   "/api/admin/posts/:postId/replies/:replyId",

  isLoggedIn,
  // isAdmin,
  // deleteReply
// );
//Route for user deleting his own replies and posts

module.exports = router;