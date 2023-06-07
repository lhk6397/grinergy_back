import Joi from "joi";

const uploadNewsSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().required(),
  contents: Joi.string().required(),
  previewImg: Joi.object()
    .keys({
      filePath: Joi.string().required(),
      fileName: Joi.string().required(),
    })
    .required(),
});

export default uploadNewsSchema;
