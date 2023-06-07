import Joi from "joi";

const uploadNoticeSchema = Joi.object({
  title: Joi.string().required(),
  contents: Joi.string().required(),
  previewImg: Joi.object().keys({
    filePath: Joi.string().required(),
    fileName: Joi.string().required(),
  }),
});

export default uploadNoticeSchema;
