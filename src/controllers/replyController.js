const { prisma } = require("../utils/common");
const addReply = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Rely content cannot be empty." });
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
const deleteOwnReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const userId = req.user.id; 

    const replyToDelete = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!replyToDelete) {
      return res.status(404).json({ error: "Reply not found." });
    }

    if (replyToDelete.userId !== userId) {
      return res.status(403).json({ error: "You can only delete your own replies." });
    }

    await prisma.reply.delete({
      where: { id: replyId },
    });

    res.status(200).json({ message: "Reply deleted successfully." });
    } catch (error) {
    next(error);
  }
};

// const adminDeleteReply = async (req, res, next) => {
//   try {
//     const { replyId } = req.params;
//     await prisma.reply.delete({

//     const reply = await prisma.reply.findUnique({
//       where: { id: replyId },
//     });

//     if (!reply) {
//       return res.status(404).json({ error: "Reply not found." });
//     }

//     if (reply.userId !== userId) {
//       return res.status(403).json({ error: "You can only delete your own replies." });
//     }

//     await prisma.reply.delete({
//       where: { id: replyId },
//     });

//     res.status(200).json({ message: "Reply deleted successfully." });
//   } catch (error) {
//     next(error);
//   }
// };
module.exports = {
  addReply,
};
