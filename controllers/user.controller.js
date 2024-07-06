const prisma = require("../prisma/prisma.client");

const userController = {
  getUserById: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await prisma.user.findUnique({
        where: { userId },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ status: "success", data: user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = userController;
