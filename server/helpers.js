// restrict routes
const restrictAccess = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
};

// restrict endpoints
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.sendStatus(401);
};

module.exports = {
  restrictAccess,
  ensureAuthenticated,
};