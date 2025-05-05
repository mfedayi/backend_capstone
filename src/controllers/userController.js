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
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
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
      return res.status(400).json({ error: "Please enter email and password" });
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please enter correct credinitals" });
    }
    const isPassMatch = await comparePassword(password, user.password);
    if (!isPassMatch) {
      return res.status(400).json({ error: "Email And Or Password Invalid" });
    }

    const token = createToken({ id: user.id });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserbyId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, firstname, lastname, username } = req.body;

    if (!firstname && !lastname && !email && !username) {
      return res.status(400).json({ error: "No update fields provided." });
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        username,
        firstname,
        lastname,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    next(error);
  }
};

const deleteSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserbyId,
  updateUser,
  deleteSingleUser,
};
