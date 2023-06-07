import ExpressError from "../libs/expressError.js";

export const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    next(new ExpressError("로그인 필요", 401));
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    next(new ExpressError("이미 로그인 되어 있습니다.", 403));
  }
};
