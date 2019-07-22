const express = require('express');
const passport = require('passport');

const router = express.Router();

// login user through auth0
router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile',
  }),
  (req, res) => res.redirect('/')
);

// save user data in db
router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login');
    req.logIn(user, async err => {
      if (err) return next(err);

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
      } finally {
        client.release();
        res.redirect('/');
      }
    });
  })(req, res, next);
});

// logout user through auth0
router.get('/logout', (req, res) => {
  req.logout();

  const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, BASE_URL } = process.env;
  res.redirect(
    `https://${AUTH0_DOMAIN}/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${BASE_URL}`
  );
});

module.exports = router;
