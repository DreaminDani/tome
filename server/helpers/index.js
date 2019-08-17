// restrict routes
const restrictAccess = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  next();
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

const canEdit = async (req, res, next) => {
  // go off and the user id for this slug
  // check if user id matches the req.user.id
  let artifactUser;
  let currentUser;

  const client = await req.app.get('db').connect();

  try {
    const getUsersForArtifact = await client.query(
      `SELECT user_id FROM artifacts WHERE id = $1`,
      [req.params.slug]
    );
    artifactUser = getUsersForArtifact.rows[0].user_id;

    const getUserByAuthID = await client.query(
      `SELECT * FROM users WHERE auth_id = $1`,
      [req.user.id]
    );
    currentUser = getUserByAuthID.rows[0].id;
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }

  if (artifactUser === currentUser) {
    next();
  } else {
    res.sendStatus(403);
  }
};

// restrict endpoints
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.sendStatus(401);
};

module.exports = {
  restrictAccess,
  ensureAuthenticated,
  serverError,
  canEdit,
};
