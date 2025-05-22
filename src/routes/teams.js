const express = require("express");
const router = express.Router();
const axios = require("axios");
const Base_URL = "https://www.thesportsdb.com/api/v1/json/3";

// Get all NBA teams
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${Base_URL}/search_all_teams.php?l=NBA`);
    console.log(response.teams);
    const teams = await response.data.teams.map((team) => ({
      teamId: team.idTeam,
      teamName: team.strTeam,
      teamLogo: team.strBadge,
    }));
    res.status(200).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch teams",
    });
  }
});

// Get team details by team name
router.get("/:teamName", async (req, res) => {
  try {
    const encodedName = encodeURIComponent(req.params.teamName);
    const response = await axios.get(
      `${Base_URL}/searchteams.php?t=${encodedName}`
    );
    const team = await response.data.teams?.[0];
    if (!team) {
      res.status(404).json({
        error: "Team not found",
      });
    }
      res.status(200).json({
        teamId: team.idTeam,
        teamName: team.strTeam,
        teamBadge: team.strBadge,
        teamLogo: team.strLogo,
        formedYear: team.intFormedYear,
        stadium: team.strStadium,
        city: team.strLocation,
        website: team.strWebsite,
        facebook: team.strFacebook,
        instagram: team.strInstagram,
        twitter: team.strTwitter,
        description: team.strDescriptionEN,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to fetch team details",
    });
  }
});

// Get team roster by team name
router.get("/players/:teamName", async (req, res) => {
  try {
    const { teamName } = req.params; // Get the team name from the request parameters
   

    const soccerKeywords = ["FC", "SC", "United", "City", "Athletic", "Club"]; // Keywords to check for soccer teams
    if (soccerKeywords.some((keyword) => teamName.includes(keyword))) {
     
      return res.status(400).json({
        error: "This API does not support soccer teams.",
      });
    }

    //Fetch the team details using team name
    const encodedName = encodeURIComponent(teamName); // Encode the team name for the URL
    const response = await axios.get( 
      `${Base_URL}/searchteams.php?t=${encodedName}` 
    );

    const team = response.data.teams?.[0]; // Get the first team from the response
    console.log("Team Data:", team); // Log the team data for debugging

    if (!team || !team.strLeague.includes("NBA")) {
     
      return res.status(404).json({
        error: "No team found with that name",
      });
    }

    // Fetch the team roster using the team ID
    const playerResponse = await axios.get(
      `${Base_URL}/lookup_all_players.php?id=${team.idTeam}` // Use the team ID to fetch players
    );
    const players = playerResponse.data?.player; // Get the players from the response
    if (!players) {
      return res.status(404).json({
        error: "No players found for this team",
      });
    }

    // Map player data to extract relevant information
    const formattedPlayers = players.map((player) => ({ // Extract relevant player information
      idPlayer: player.idPlayer,
      name: player.strPlayer,
      position: player.strPosition,
      nationality: player.strNationality,
      cutout: player.strCutout, // Player cutout image
    }));
    res.status(200).json(formattedPlayers); // Send the formatted players as a response
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({
      error: "Failed to fetch players",
    });
  }
});

module.exports = router;
