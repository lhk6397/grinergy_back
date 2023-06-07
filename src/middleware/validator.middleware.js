import Joi from "joi";
//* Include all validators
import schemas from "../libs/validators/index.js";
import ExpressError from "../libs/expressError.js";

function Validator(validator) {
  //! If validator is not exist, throw err
  if (!schemas.hasOwnProperty(validator))
    throw new ExpressError(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const validated = await schemas[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err.isJoi) return next(new ExpressError(err.message, 400));
      next(err);
    }
  };
}

export default Validator;
