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

const getMe = async (req, res, next) => {
  try {
    // Fetch the current user by ID, selecting only safe fields
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

// Fetch all users (use middleware to protect this route)
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
      }
    });
    res.json(users); // Send the list of users as a response
  } catch (error) {
    next(error);
  }
};

// Fetch single user by ID
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
      }
    });
    // Check if user exists
    if (!user)
      return res.status(404).json({ error: "User not found" });
    res.json(user); // Send the user data as a response
  } catch (error) {
    next(error);
  }
}

// Export functions to be used in routes
module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserbyId
};
