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

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc', // Show newest posts first
      },
      include: {
        user: { 
          select: {
            id: true,
            username: true,
          },
        },
        replies: { 
          orderBy: {
            createdAt: 'asc', 
          },
          include: {
            user: { 
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addPost,
  getAllPosts,
};
