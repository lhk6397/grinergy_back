import Joi from "joi";

const updateNoticeSchema = Joi.object({
  title: Joi.string(),
  contents: Joi.string(),
  files: Joi.object().keys({
    filePath: Joi.string().required(),
    fileName: Joi.string().required(),
  }),
  deleteFiles: Joi.alternatives().try(
    Joi.string(),
    Joi.array(),
    Joi.allow(null)
  ),
});

export default updateNoticeSchema;
