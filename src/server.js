const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
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
      console.log("CORS Origin:", origin);
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://fsa-cap.netlify.app",
      ];
      const netlifyPreviewRegex = /^https:\/\/[\w.-]+--fsa-cap\.netlify\.app$/;
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

// Test route to check if the server is live.
app.get("/api/ping", (req, res) => {
  res.send({ message: "We are Live!!" });
});

app.use("/api/user", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/news", newsRoutes);

// Start the server on the specified port or default to 3000.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER running on PORT: ${PORT}`);
});

// Error handler middleware, should be the last middleware.
app.use(errorHandler);
