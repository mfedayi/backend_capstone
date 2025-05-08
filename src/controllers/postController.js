const { prisma } = require("../utils/common");
const addPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Post content is required." });
    }
    const post = await prisma.post.create({
      data: {
        userId: req.user.id,
        content,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addPost,
};
