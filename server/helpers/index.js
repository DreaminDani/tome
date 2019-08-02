// restrict routes
const restrictAccess = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  next();
};

// restrict endpoints
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.sendStatus(401);
};

const serverError = (
  req,
  res,
  error = null,
  code = 500,
  description = 'Server Error'
) => {
  console.error(
    `Error occurred in request. Sent ${code} response with description: ${description}.
      Request details: ${JSON.stringify(req)}
      ${error ? `Stack trace: ${JSON.stringify(error.stack)}` : ''}
    `
  );
  res.status(code);
  res.send({ error: description });
};

module.exports = {
  restrictAccess,
  ensureAuthenticated,
  serverError,
};
