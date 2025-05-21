const axios = require("axios"); // Import axios to make API requests
const { prisma } = require("../utils/common");

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
    });

    if (!favorites || favorites.length === 0) {
      return res.status(404).json({ error: "favorite teams does not exist" });
    }

    const teamIds = favorites.map((fav) => fav.teamId); // get all teamIds from the favorites model
    const allTeams = await axios.get(
      "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA"
    );
   
    const favTeams = allTeams.data.teams.filter((team) => teamIds.includes(parseInt(team.idTeam))
  ); // filter the teams based on the teamIds from favorites

    if (!favTeams || favTeams.length === 0) {
      return res.status(400).json({ error: "Favorite do not match" });
    }
  
    const favTeamData = favTeams.map((team) => ({
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
    const { teamId } = req.params; // Get the teamId from the request parameters


    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user.id,
        teamId: parseInt(teamId), // Parse the teamId to an integer
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
        teamId: parseInt(teamId), // Parse the teamId to an integer
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error("Error adding favorite team:", error); // Log the error for debugging
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
          teamId: parseInt(teamId), // Parse the teamId to an integer
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

module.exports = {
  getFavorites,
  addFavoriteTeam,
  removeFavoriteTeam,
};
