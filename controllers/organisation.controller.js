const prisma = require("../prisma/prisma.client");

const OrganisationController = {
  getAllOrganisations: async (req, res) => {
    try {
      // Retrieve organisations that the logged-in user belongs to
      const organisations = await prisma.organisation.findMany({
        where: {
          user: {
            some: {
              userId: req.user.userId // Organisations the user belongs to
            }
          }
        }
      });

      res.status(200).json({
        status: "success",
        message: "Organisations retrieved successfully",
        data: { organisations }
      });
    } catch (error) {
      console.error("Error fetching organisations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getOrganisationById: async (req, res) => {
    const orgId = req.params.orgId;
    try {
      const organisation = await prisma.organisation.findUnique({
        where: { orgId }
      });
      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }
      res.status(200).json({
        status: "success",
        message: "Organisation retrieved successfully",
        data: organisation
      });
    } catch (error) {
      console.error("Error fetching organisation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createOrganisation: async (req, res) => {
    const { name, description } = req.body;
    const loggedInUserId = req.user.userId;

    try {
      // Create the organisation
      const organisation = await prisma.organisation.create({
        data: { name, description }
      });

      await prisma.organisationOnUser.create({
        data: {
          userId: loggedInUserId,
          organisationId: organisation.orgId
        }
      });

      res.status(201).json({
        status: "success",
        message:
          "Organisation created and associated with the user successfully",
        data: organisation
      });
    } catch (error) {
      console.error("Error creating organisation:", error);
      res.status(400).json({
        status: "Bad request",
        message: "Client error",
        statusCode: 400
      });
    }
  },

  addUserToOrganisation: async (req, res) => {
    const { userId } = req.body;
    const { orgId } = req.params;

    try {
      const user = await prisma.user.findUnique({ where: { userId } });
      if (!user) {
        throw new Error("User not found");
      }

      const organisation = await prisma.organisation.findUnique({
        where: { orgId }
      });
      if (!organisation) {
        throw new Error("Organisation not found");
      }

      await prisma.organisationOnUser.create({
        data: {
          userId,
          organisationId: orgId
        }
      });

      res.status(200).json({
        status: "success",
        message: "User added to organisation successfully"
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = OrganisationController;
