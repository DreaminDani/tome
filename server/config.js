const uid = require('uid-safe');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const PostgreSqlStore = require('connect-pg-simple')(session);

const connectionString = process.env.TARGET_URI;

const sessionConfig = {
  secret: process.env.NODE_ENV === 'production' ? uid.sync(18) : 'secret',
  cookie: {
    maxAge: 86400 * 1000, // 24 hours in milliseconds
  },
  resave: false,
  saveUninitialized: true,
  store: new PostgreSqlStore({
    conString: connectionString,
  }),
};

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL, // TODO build this based on BASE_URL
  },
  function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }
);

const localStrategy = db =>
  new LocalStrategy(function(email, password, cb) {
    const client = db.connect();

    client.query(
      'SELECT * FROM users WHERE email = $1', // update to include password crypt
      [email],
      function(err, getUser) {
        if (err) {
          client.release();
          return cb(err);
        }

        if (getUser.rows[0]) {
          client.release();
          return cb(null, getUser.rows[0].auth_metadata);
        }

        client.release();
        return cb(null, false);
      }
    );
  });

module.exports = {
  connectionString,
  sessionConfig,
  googleStrategy,
  localStrategy,
};
