const prisma = require("../prisma/prisma.client");

const userController = {
  getUserById: async (req, res) => {
    const userId = req.params.id;
    const loggedInUserId = req.user.userId; // Assuming the logged-in user's ID is attached to the request

    try {
      // Fetch the logged-in user's organisations
      const loggedInUserOrganisations =
        await prisma.organisationOnUser.findMany({
          where: { userId: loggedInUserId },
          select: { organisationId: true }
        });

      const organisationIds = loggedInUserOrganisations.map(
        (org) => org.organisationId
      );

      // Fetch the user record only if it belongs to the same organisation or is the logged-in user
      const user = await prisma.user.findFirst({
        where: {
          userId,
          OR: [
            { userId: loggedInUserId },
            {
              orgs: {
                some: {
                  organisationId: {
                    in: organisationIds
                  }
                }
              }
            }
          ]
        },
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

      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = userController;
