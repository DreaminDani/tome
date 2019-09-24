const { serverError } = require('../helpers');

const _commitUserToDatabase = async (req, res, next, error, user) => {
  if (error) return next(error);

  const client = await req.app.get('db').connect();

  try {
    const getUser = await client.query(
      'SELECT * FROM users WHERE auth_id = $1',
      [user.id]
    );
    if (getUser.rows[0]) {
      await client.query(
        `
          UPDATE users
          SET auth_metadata = $1
          WHERE
            id = $2;
        `,
        [user._json, getUser.rows[0].id]
      );
    } else {
      await client.query(
        `
          INSERT INTO users(auth_id, auth_metadata)
          VALUES($1, $2);
        `,
        [user.id, user._json]
      );
    }
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }
};

async function callback(req, res, next, err, user) {
  if (err) return next(err);
  if (!user) return res.redirect('/login');
  await req.logIn(user, async error =>
    _commitUserToDatabase(req, res, next, error, user)
  );
  res.redirect('/');
}

const logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

module.exports = {
  _commitUserToDatabase,
  callback,
  logout,
};
