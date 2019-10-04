const express = require('express');
const passport = require('passport');

const {
  callback,
  loginWithLocal,
  signUpWithLocal,
  logout,
} = require('./commands');

const router = express.Router();

// TODO add a basic login screen (.get()) with optional message
//  e.g. "you must be logged in to access"
//  Default message is "log in to tome"
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', async (err, user) =>
    loginWithLocal(req, res, next, err, user)
  )(req, res, next);
});

router.post('/signup', signUpWithLocal, async (req, res, next) => {
  passport.authenticate('local', async (err, user) =>
    loginWithLocal(req, res, next, err, user)
  )(req, res, next);
});

// login user through google
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: 'openid email profile' })
);

router.get('/auth/google/callback', async (req, res, next) => {
  passport.authenticate('google', async (err, user) =>
    callback(req, res, next, err, user)
  )(req, res, next);
});

// save user data in db
// TODO convert this to use username and password
// router.get('/callback', async (req, res, next) => {
//   passport.authenticate('auth0', async (err, user) =>
//     callback(req, res, next, err, user)
//   )(req, res, next);
// });

// logout user through auth0
router.get('/logout', logout);

module.exports = router;
