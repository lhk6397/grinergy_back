import Joi from "joi";

const loginSchema = Joi.object({
  userId: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export default loginSchema;
