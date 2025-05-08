const { prisma } = require("../utils/common");

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!favorites) {
      return res.status(404).json({ error: "favorite teams does not exist" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const addFavoriteTeam = async (req, res, next) => {
  res.json("Adding favorite teams");
};

module.exports = {
  getFavorites,
  addFavoriteTeam,
};
