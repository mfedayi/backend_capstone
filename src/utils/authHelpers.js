const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const createToken = (payload) => {
  if (!SECRET) {
    throw new Error("JWT Token is missing");
  }
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
};
