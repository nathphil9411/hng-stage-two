const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message
    }));
    return res.status(422).json({ errors });
  }
  next();
};

const registerSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  phone: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required()
});
const createOrgSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string()
});

const addUserToOrganisationSchema = Joi.object({
  userId: Joi.string().required()
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createOrgSchema,
  addUserToOrganisationSchema
};
