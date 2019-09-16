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

// replace circular references when logging
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#Examples
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
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
      Request details: ${JSON.stringify(req, getCircularReplacer())}
      ${
        error
          ? `Stack trace: ${JSON.parse(
              JSON.stringify(error.stack, getCircularReplacer())
            )}`
          : ''
      }
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
