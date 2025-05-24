const express = require("express"); // Express framework
const morgan = require("morgan"); // HTTP request logger
const dotenv = require("dotenv"); // Environment variable configuration
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler"); // Error handling middleware
const userRoutes = require("./routes/user"); // User routes
const teamRoutes = require("./routes/teams"); // Team routes
const postRoutes = require("./routes/posts"); // Post routes
const replyRoutes = require("./routes/reply"); // Reply routes
const favoriteRoutes = require("./routes/favorites");
const newsRoutes = require("./routes/team_news");

dotenv.config(); // Load environment variables

const app = express(); // Create an instance of express

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://fsa-cap.netlify.app",
      ];

      const netlifyPreviewRegex =
        /^https:\/\/[a-z0-9]+--fsa-cap\.netlify\.app$/;

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        netlifyPreviewRegex.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middleware
app.use(morgan("dev"));
app.use(express.json());

//Temporary test route
app.get("/api/ping", (req, res) => {
  res.send({ message: "We are Live!!" });
});

app.use("/api/user", userRoutes); // User routes setup
app.use("/api/teams", teamRoutes);
app.use("/api/posts", postRoutes); // Post routes setup
app.use("/api/replies", replyRoutes); // Reply routes setup
app.use("/api/favorites", favoriteRoutes);
app.use("/api/news", newsRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER running on PORT: ${PORT}`);
});

//Keep at the bottom
app.use(errorHandler);
