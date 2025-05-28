const express = require("express");
const router = express.Router();
const axios = require("axios");
const Base_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = "da69618ddeba4274a2a5aeed22f4a599";

// Route to get news articles for a specific team.
router.get("/team/:teamName", async (req, res, next) => {
  try {
    const encodedName = encodeURIComponent(req.params.teamName);
    const response = await axios.get(`${Base_URL}`, {
      params: {
        q: req.params.teamName,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 10,
        apiKey: NEWS_API_KEY,
      },
    });

    const articles = await response.data.articles.map((article) => ({
      title: article.title,
      url: article.url,
      author: article.author,
      urlToImage: article.urlToImage,
    }));

    res.json(articles);
  } catch (error) {
    console.error("News API Error:", error.message);
    next(error);
  }
});

module.exports = router;
