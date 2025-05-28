const { prisma } = require("../utils/common");
const addPost = async (req, res, next) => {
  // Adds a new post to the forum.
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
  // Retrieves all posts from the forum, ordered by creation date (most recent first).
  try {
    const currentUserId = req.user?.id; // Get current user's ID if logged in
    const rawPosts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", 
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        votes: { // Include votes to determine current user's vote
          select: {
            userId: true,
            type: true,
          }
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
            votes: { // Include votes for replies
              select: {
                userId: true,
                type: true,
              }
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
                votes: {
                  select: {
                    userId: true,
                    type: true,
                  }
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
                    votes: {
                      select: {
                        userId: true,
                        type: true,
                      }
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
                        votes: {
                          select: {
                            userId: true,
                            type: true,
                          }
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
                            votes: {
                              select: {
                                userId: true,
                                type: true,
                              }
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
                                votes: {
                                  select: {
                                    userId: true,
                                    type: true,
                                  }
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

    // Helper function to process votes for posts and replies recursively
    const processVotes = (item) => {
      let userVoteType = null;
      // item.votes will exist due to the 'include' in the Prisma query
      if (currentUserId && item.votes) {
        const voteRecord = item.votes.find(vote => vote.userId === currentUserId);
        if (voteRecord) {
          userVoteType = voteRecord.type;
        }
      }
      
      const processedItem = { 
        ...item, 
        userVote: userVoteType, // Will be null if no vote or user not logged in
        // likeCount and dislikeCount are already on the item from Prisma
      };
      delete processedItem.votes; // Remove the full votes array from the final output

      if (processedItem.replies) { // For top-level replies of a post
        processedItem.replies = processedItem.replies.map(reply => processVotes(reply));
      }
      if (processedItem.childReplies) { // For nested replies
        processedItem.childReplies = processedItem.childReplies.map(child => processVotes(child));
      }
      return processedItem;
    };

    const posts = rawPosts.map(post => processVotes(post));
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
const softDeleteOwnPost = async (req, res, next) => {
  // Soft deletes a post by marking its content as deleted.
  try {
    const { postId } = req.params;
    const userId = req.user.id; 

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
  // Permanently deletes a post and its replies (Admin only).
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
  // Updates the content of an existing post.
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

const votePost = async (req, res, next) => {
  // Handles voting (like/dislike) on a post.
  try {
    const { postId } = req.params;
    const { voteType } = req.body; // 'LIKE' or 'DISLIKE'
    const userId = req.user.id;

    if (!["LIKE", "DISLIKE"].includes(voteType)) {
      return res.status(400).json({ error: "Invalid vote type." });
    }

    const existingVote = await prisma.postVote.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    await prisma.$transaction(async (tx) => {
      let likeIncrement = 0;
      let dislikeIncrement = 0;

      if (existingVote) {
        // User is changing their vote or removing it
        if (existingVote.type === voteType) {
          // Removing vote
          await tx.postVote.delete({ where: { id: existingVote.id } });
          if (voteType === "LIKE") likeIncrement = -1;
          else dislikeIncrement = -1;
        } else {
          // Changing vote type
          await tx.postVote.update({
            where: { id: existingVote.id },
            data: { type: voteType },
          });
          if (voteType === "LIKE") {
            likeIncrement = 1;
            dislikeIncrement = -1; // Was a dislike before
          } else {
            dislikeIncrement = 1;
            likeIncrement = -1; // Was a like before
          }
        }
      } else {
        // New vote
        await tx.postVote.create({
          data: {
            postId,
            userId,
            type: voteType,
          },
        });
        if (voteType === "LIKE") likeIncrement = 1;
        else dislikeIncrement = 1;
      }

      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          likeCount: { increment: likeIncrement },
          dislikeCount: { increment: dislikeIncrement },
        },
        select: { id: true, likeCount: true, dislikeCount: true } // Select only necessary fields
      });
      res.json({ ...updatedPost, userVote: existingVote && existingVote.type === voteType ? null : voteType });
    });
  } catch (error) {
    next(error);
  }
};

// Gets all posts made by a specific user
const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const posts = await prisma.post.findMany({
      where: { userId: userId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        likeCount: true,
        dislikeCount: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
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
  votePost,
  getUserPosts,
};
