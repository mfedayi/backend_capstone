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
    const favTeam = allTeams.filter((team) => teamIds.includes(team.teamId));
    const favTeamData = favTeam.map((f) =>({
        teamId: team.idTeam,
        teamName: team.strTeam,
        teamLogo: team.strBadge
    })) 
    res.json(favTeamData);
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
