const { prisma } = require("../utils/common");
const addReply = async (req, res, next) => {
  res.json("Adding a new Reply");
};

module.exports = {
  addReply,
};
