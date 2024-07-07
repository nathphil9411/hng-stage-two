const express = require("express");

const {
  validate,
  createOrgSchema,
  addUserToOrganisationSchema
} = require("../middlewares/validation");
const authenticate = require("../middlewares/authenticate");
const organisationController = require("../controllers/organisation.controller");
const router = express.Router();

router.get("/", authenticate, organisationController.getAllOrganisations);
router.get("/:orgId", authenticate, organisationController.getOrganisationById);
router.post(
  "/",
  validate(createOrgSchema),
  authenticate,
  organisationController.createOrganisation
);
router.post(
  "/:orgId/users",
  validate(addUserToOrganisationSchema),
  organisationController.addUserToOrganisation
);

module.exports = router;
