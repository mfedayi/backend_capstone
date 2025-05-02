const { prisma } = require("../utils/common");

const updateUserById = async (userId, updateData) => {
  if (updateData.email) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email: updateData.email,
        id: { not: userId },
      },
    });
    if (emailExists) {
      const error = new Error("Email already in use by another account.");
      error.statusCode = 400;
      throw error;
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
    return updatedUser;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

const deleteUserById = async (userId) => {
  await prisma.user.delete({
    where: { id: userId },
  });
};

module.exports = {
  updateUserById,
  deleteUserById,
};
