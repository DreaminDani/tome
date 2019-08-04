const express = require('express');
const passport = require('passport');

const { callback, logout } = require('./commands');

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
router.get('/callback', async (req, res, next) => {
  passport.authenticate('auth0', async (err, user) =>
    callback(req, res, next, err, user)
  )(req, res, next);
});

// logout user through auth0
router.get('/logout', logout);

module.exports = router;
