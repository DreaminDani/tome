const getEmailFromAuthProvider = user => {
  if (user.email) {
    return user.email;
  }

  if (user.emails && user.emails[0] && user.emails[0].value) {
    return user.emails[0].value;
  }

  if (user._json && user._json.email) {
    return user._json.email;
  }

  throw new Error('Cannot determine email address from Auth Provider');
};

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
  getEmailFromAuthProvider,
  restrictAccess,
  ensureAuthenticated,
  serverError,
};
