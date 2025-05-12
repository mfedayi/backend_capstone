const { prisma } = require("../utils/common");
const addReply = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        userId,
        postId,
      },
    });
    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReply,
};
