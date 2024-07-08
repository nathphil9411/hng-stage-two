const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prisma.client");

const AuthController = {
  registerUser: async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user and default organisation
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          orgs: {
            create: [
              {
                organisation: {
                  create: { name: `${firstName}'s Organisation` }
                }
              }
            ]
          }
        },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      });

      // Generate JWT token
      const accessToken = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: { accessToken, user }
      });
    } catch (error) {
      //Duplicate email error.
      if (error.code === "P2002" && error.meta.target.includes("email")) {
        return res.status(400).json({
        status: "Bad request",
        message: "Registration unsuccessful",
        statusCode: 400
      });
      console.error("Error registering user:", error);
      res.status(400).json({
        status: "Bad request",
        message: "Registration unsuccessful",
        statusCode: 400
      });
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res
          .status(401)
          .json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: 401
          });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res
          .status(401)
          .json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: 401
          });
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: { accessToken, user }
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      res
        .status(400)
        .json({
          status: "Bad request",
          message: "Authentication failed",
          statusCode: 401
        });
    }
  }
};

module.exports = AuthController;
