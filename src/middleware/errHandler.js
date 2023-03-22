import ExpressError from "../utils/expressError.js";

const errHandler = (err, req, res, next) => {
  const { stack, statusCode = 500, message = "Server Error" } = err;
  console.log(stack);
  if (err instanceof ExpressError) {
    return res.status(statusCode).json({
      ok: false,
      message,
    });
  } else {
    return res.status(422).json({
      ok: false,
      message: "잘못된 접근입니다.",
    });
  }
};

export default errHandler;