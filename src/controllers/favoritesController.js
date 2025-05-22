const axios = require("axios"); 
const { prisma } = require("../utils/common");

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
    });

    if (!favorites || favorites.length === 0) {
      return res.status(404).json({ error: "favorite teams does not exist" });
    }

    const teamIds = favorites.map((fav) => fav.teamId); 
    const allTeams = await axios.get(
      "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA"
    );
    const favTeams = allTeams.data.teams.filter((team) => teamIds.includes(parseInt(team.idTeam))
  ); 

    if (!favTeams || favTeams.length === 0) {
      return res.status(400).json({ error: "Favorite do not match" });
    }
    const favTeamData = favTeams.map((team) => ({
      teamId: team.idTeam,
      teamName: team.strTeam,
      teamLogo: team.strTeamBadge || team.strBadge, // Consistent with getUserPublicFavorites
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
        teamId: parseInt(teamId), 
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
        teamId: parseInt(teamId), 
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

const removeFavoriteTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const favorite = await prisma.favorite.delete({
      where: {
        userId_teamId: {
          userId: req.user.id,
          teamId: parseInt(teamId), 
        },
      },
    });

    if (!favorite) {
      return res.status(404).json({
        error: "Favorite team not found",
      });
    }

    res.status(200).json({message: "Team removed from favorites"});
  } catch (error) {
    next(error);
  }
};

const getUserPublicFavorites = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const favorites = await prisma.favorite.findMany({
      where: { userId: userId },
    });

    if (!favorites || favorites.length === 0) {
      return res.json([]);
    }

    const teamIds = favorites.map((fav) => fav.teamId);
    const allTeamsResponse = await axios.get(
      "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA"
    );

    if (!allTeamsResponse.data || !allTeamsResponse.data.teams) {
      console.error("Unexpected response from external sports API for public favorites");
      return res.status(500).json({ error: "Could not fetch team data." });
    }

    const favTeams = allTeamsResponse.data.teams.filter((team) =>
      teamIds.includes(parseInt(team.idTeam))
    );

    const favTeamData = favTeams.map((team) => ({
      teamId: team.idTeam,
      teamName: team.strTeam,
      teamLogo: team.strTeamBadge || team.strBadge, 
    }));
    
    res.json(favTeamData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavoriteTeam,
  removeFavoriteTeam,
  getUserPublicFavorites,
};
