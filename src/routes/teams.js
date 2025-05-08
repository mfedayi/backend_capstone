const express = require("express");
const router = express.Router();
const Base_URL = "https://www.thesportsdb.com/api/v1/json/3";
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${Base_URL}search_all_teams.php?l=NBA`);
    const teams = response.data.teams.map((team) => ({
      teamId: team.idTeam,
      teamName: team.strTeam,
      teamLogo: team.strBadge,
    }));
    res.json(teams);
  } catch (error) {
    res.status("500").json({
      error: "Failed to fetch teams",
    });
  }
});

router.get("/:teamName", async (req, res) => {
  try {
    const encodedName = encodeURIComponent(req.params.teamName);
    const response = await axios.get(
      `${Base_URL}/searchteams.php?t=${encodedName}`
    );
    const team = response.data.teams?.[0];
    if (!team) {
      res.status(404).json({
        error: "Team not found",
      });

      res.json({
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
    }

    res.send("Team details for a single team");
  } catch (error) {}
});
