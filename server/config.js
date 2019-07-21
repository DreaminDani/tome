const uid = require('uid-safe');
const Auth0Strategy = require("passport-auth0");
const session = require("express-session");
const PostgreSqlStore = require('connect-pg-simple')(session);

const connectionString = process.env.TARGET_URI

const sessionConfig = {
  secret: process.env.NODE_ENV === "production" ? uid.sync(18) : "secret",
  cookie: {
    maxAge: 86400 * 1000 // 24 hours in milliseconds
  },
  resave: false,
  saveUninitialized: true,
  store: new PostgreSqlStore({
    conString: connectionString
  })
};

const auth0Strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
);

module.exports = {
  connectionString,
  sessionConfig,
  auth0Strategy
};