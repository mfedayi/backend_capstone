const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const userRouter = require("./routes/user");

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(express.json());

//Temporary test route
app.get("/api/ping", (req, res) => {
  res.send({ message: "We are Live!!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER running on PORT: ${PORT}`);
});

app.use("/api/user", userRouter);

//Keep at the bottom
app.use(errorHandler);
