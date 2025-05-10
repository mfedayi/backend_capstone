const { useParams } = require("react-router-dom");
const { prisma } = require("../utils/common");

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
    });

    if (!favorites) {
      return res.status(404).json({ error: "favorite teams does not exist" });
    }

    const teamIds = await favorites.map((fav) => fav.teamId);
    const response = await axios.get(
      "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA"
    );
    const allTeams = response.data.teams;
    const favTeam = allTeams.filter((team) => teamIds.includes(team.idTeam)); // match saved teamIds in Favorites model to external API's idTeam.
    if (!favTeam) {
      res.status(400).json({ error: "Favorite do not match" });
    }

    const favTeamData = favTeam.map((team) => ({
      teamId: team.idTeam,
      teamName: team.strTeam,
      teamLogo: team.strBadge,
    }));
    res.json(favTeamData);
  } catch (error) {
    next(error);
  }
};

const addFavoriteTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user.id,
        teamId: teamId,
      },
    });

    if (existing) {
      return res.status(400).json({
        error: "Team is already in favorites",
      });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        teamId: teamId,
      },
    });
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavoriteTeam,
};
