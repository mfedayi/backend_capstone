const express = require("express"); // Express framework
const morgan = require("morgan"); // HTTP request logger
const dotenv = require("dotenv"); // Environment variable configuration
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler"); // Error handling middleware
const userRoutes = require("./routes/user"); // User routes

dotenv.config(); // Load environment variables

const app = express(); // Create an instance of express

app.use(
  cors({
    origin: /http:\/\/localhost:\d+$/, // reg expression to allow a dynamic Port
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER running on PORT: ${PORT}`);
});

//Keep at the bottom
app.use(errorHandler);
