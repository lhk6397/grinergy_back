const isAuthMiddleware = (req, res, next) => {
  if (!req.session.loggedInUser || !(req.session.level === 1)) {
    return res.json({ isAdmin: false, error: true });
  }
  next();
};

export default isAuthMiddleware;
