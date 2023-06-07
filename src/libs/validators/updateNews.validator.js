import Joi from "joi";

const updateNewsSchema = Joi.object({
  title: Joi.string(),
  url: Joi.string(),
  contents: Joi.string(),
  image: Joi.object().keys({
    filePath: Joi.string().required(),
    fileName: Joi.string().required(),
  }),
});

export default updateNewsSchema;
