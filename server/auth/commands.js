const { serverError, getEmailFromAuthProvider } = require('../helpers');
const { getUserByEmail, addUser } = require('../data/users');

const signUpWithLocal = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  // todo validate inputs

  const client = await req.app.get('db').connect();

  try {
    const user = await getUserByEmail(client, email);
    if (user) {
      return res.status(400).send({
        message:
          'There is already an account with that email address. Please login instead.',
      });
    }

    await addUser(client, email, password, firstName, lastName);
    next();
  } catch (e) {
    serverError(e);
  } finally {
    client.release();
  }
};

const loginWithLocal = async (req, res, next, err, user) => {
  if (err) return next(err);
  if (!user) {
    return res.status(400).send({
      message: 'Invalid username or password',
    });
  }
  await req.logIn(user, async error => {
    console.log(user);
  });
  res.redirect('/');
};

const _commitUserToDatabase = async (req, res, next, error, user) => {
  if (error) return next(error);

  const client = await req.app.get('db').connect();

  try {
    const email = getEmailFromAuthProvider(user);
    // todo extract this to data helpers
    const getUser = await client.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
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
          INSERT INTO users(email, auth_metadata)
          VALUES($1, $2);
        `,
        [email, user._json]
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
  loginWithLocal,
  signUpWithLocal,
  _commitUserToDatabase,
  callback,
  logout,
};
