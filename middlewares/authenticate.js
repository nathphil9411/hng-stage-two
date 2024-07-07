const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prisma.client");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        errors: [
          {
            field: "authorization",
            message: "Unauthorized"
          }
        ]
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({
        errors: [
          {
            field: "authorization",
            message: "Unauthorized"
          }
        ]
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      errors: [
        {
          field: "authorization",
          message: "Unauthorized"
        }
      ]
    });
  }
};

module.exports = authenticate;
