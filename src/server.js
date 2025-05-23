const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/teams");
const postRoutes = require("./routes/posts");
const replyRoutes = require("./routes/reply");
const favoriteRoutes = require("./routes/favorites")
const newsRoutes = require("./routes/team_news")

dotenv.config(); // Load environment variables

const app = express(); // Create an instance of express

app.use(
  cors({
    origin: /http:\/\/localhost:\d+$/, // Allow requests from localhost on any port
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
app.use("/api/news", newsRoutes)

// Start the server on the specified port or default to 3000.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER running on PORT: ${PORT}`);
});

// Error handler middleware, should be the last middleware.
app.use(errorHandler);
