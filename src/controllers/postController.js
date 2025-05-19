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
        createdAt: "desc", // Show newest posts first
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        replies: {
          where: { parentId: null },
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            childReplies: {
              // Level 1 children of top-level replies
              orderBy: {
                createdAt: "asc",
              },
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
                childReplies: {
                  // Level 2 children (children of Level 1)
                  orderBy: {
                    createdAt: "asc",
                  },
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true,
                      },
                    },
                    childReplies: {
                      // Level 3 children (children of Level 2)
                      orderBy: {
                        createdAt: "asc",
                      },
                      include: {
                        user: {
                          select: {
                            id: true,
                            username: true,
                          },
                        },
                        childReplies: {
                          // Level 4 children (children of Level 3)
                          orderBy: {
                            createdAt: "asc",
                          },
                          include: {
                            user: {
                              select: {
                                id: true,
                                username: true,
                              },
                            },
                            childReplies: {
                              // Level 5 children (children of Level 4)
                              orderBy: {
                                createdAt: "asc",
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
                        },
                      },
                    },
                  },
                },
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
const softDeleteOwnPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // From isLoggedIn middleware

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post." });
    }

    // Soft delete: Update content
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content: "[deleted by user]",
      },
    });

    res
      .status(200)
      .json({ message: "Post content marked as deleted.", post: updatedPost });
  } catch (error) {
    next(error);
  }
};

const adminDeletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    await prisma.post.delete({ where: { id: postId } });
    res
      .status(200)
      .json({ message: "Post and its replies permanently deleted by admin." });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Post content is required." });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post." });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content },
    });

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addPost,
  getAllPosts,
  softDeleteOwnPost,
  adminDeletePost,
  updatePost,
};
