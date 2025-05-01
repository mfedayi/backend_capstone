const { prisma } = require("../utils/common");

const {
  hashPassword,
  comparePassword,
  createToken,
} = require("../utils/authHelpers");

//POST /api/user/register
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, firstname, lastname } = req.body;

    if (!username || !email || !password || !firstname || !lastname) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [emailExists, usernameExists] = await Promise.all([
      await prisma.user.findUnique({ where: { email } }),
      await prisma.user.findUnique({ where: { username } }),
    ]);
    if (emailExists || usernameExists) {
      const errors = [];
      if (emailExists) errors.push("Email already in use.");
      if (usernameExists) errors.push("username already taken");
      return res.status(400).json({ errors });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, firstname, lastname },
    });

    const token = createToken({ id: user.id });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Please enter email and password" });
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      res.status(400).json({ error: "Please enter correct credinitals" });
    }
    const isPassMatch = await comparePassword(password, user.password);
    if (!isPassMatch) {
      res.status(400).json({ error: "Email And Or Password Invalid" });
    }

    const token = createToken({ id: user.id });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
