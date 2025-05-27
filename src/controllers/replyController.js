const { prisma } = require("../utils/common");
const addReply = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Reply content cannot be empty." });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        userId,
        postId,
        parentId,
      },
    });
    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
};
const softDeleteOwnReply = async (req, res, next) => {
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
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this reply." });
    }

    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
      data: {
        content: "[reply has been deleted by the user]",
      },
    });

    res.status(200).json({
      message: "Reply content marked as deleted.",
      reply: updatedReply,
    });
  } catch (error) {
    next(error);
  }
};

const adminDeleteReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    await prisma.reply.delete({ where: { id: replyId } });
    res.status(200).json({ message: "Reply deleted by admin." });
  } catch (error) {
    next(error);
  }
};

const updateReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Reply content cannot be empty." });
    }

    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      return res.status(404).json({ error: "Reply not found." });
    }

    if (reply.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this reply." });
    }

    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
      data: { content },
    });
    res.json(updatedReply);
  } catch (error) {
    next(error);
  }
};

const voteReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const { voteType } = req.body; 
    const userId = req.user.id;

    if (!["LIKE", "DISLIKE"].includes(voteType)) {
      return res.status(400).json({ error: "Invalid vote type." });
    }

    const existingVote = await prisma.replyVote.findUnique({
      where: {
        replyId_userId: {
          replyId,
          userId,
        },
      },
    });

    await prisma.$transaction(async (tx) => {
      let likeIncrement = 0;
      let dislikeIncrement = 0;

      if (existingVote) {
        if (existingVote.type === voteType) {
          // Removing vote
          await tx.replyVote.delete({ where: { id: existingVote.id } });
          if (voteType === "LIKE") likeIncrement = -1;
          else dislikeIncrement = -1;
        } else {
          // Changing vote type
          await tx.replyVote.update({
            where: { id: existingVote.id },
            data: { type: voteType },
          });
          if (voteType === "LIKE") {
            likeIncrement = 1;
            dislikeIncrement = -1;
          } else {
            dislikeIncrement = 1;
            likeIncrement = -1;
          }
        }
      } else {
        // New vote
        await tx.replyVote.create({
          data: {
            replyId,
            userId,
            type: voteType,
          },
        });
        if (voteType === "LIKE") likeIncrement = 1;
        else dislikeIncrement = 1;
      }

      const updatedReply = await tx.reply.update({
        where: { id: replyId },
        data: {
          likeCount: { increment: likeIncrement },
          dislikeCount: { increment: dislikeIncrement },
        },
        select: { id: true, likeCount: true, dislikeCount: true }
      });
      res.json({ ...updatedReply, userVote: existingVote && existingVote.type === voteType ? null : voteType });
    });
  } catch (error) {
    next(error);
  }
};

// Gets all replies made by a specific user
const getUserReplies = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const replies = await prisma.reply.findMany({
      where: { userId: userId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        postId: true, // To know which post it belongs to
        likeCount: true,
        dislikeCount: true,
        post: { select: { id: true, content: true } } // Optionally include some parent post info
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(replies);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReply,
  softDeleteOwnReply,
  adminDeleteReply,
  updateReply,
  voteReply,
  getUserReplies,
};
