const dev = process.env.NODE_ENV !== 'production';
if (dev) {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const express = require('express');
const http = require('http');
const next = require('next');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const {
  sessionConfig,
  googleStrategy,
  localStrategy,
  connectionString,
} = require('./config');
const { ensureSecure, restrictAccess } = require('./helpers');

const authRoutes = require('./auth');
const artifactAPI = require('./api/artifact');

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const pool = new Pool({ connectionString });
  pool.on('error', (err, client) => {
    console.error(`Unexpected error on idle client: ${client}`, err);
    process.exit(-1);
  });
  server.set('db', pool);

  server.use(bodyParser.json());
  if (!dev) {
    //  http://expressjs.com/en/4x/api.html#app.set
    // trust proxy provided headers, since we'll be
    //  running this behind load balancer / proxy
    server.enable('trust proxy');
    server.use(ensureSecure);
  }

  // auth config
  server.use(session(sessionConfig));
  passport.use(googleStrategy);
  passport.use(localStrategy(pool));
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  server.use(passport.initialize());
  server.use(passport.session());

  // api endpoints
  server.use('/api', artifactAPI);

  // routes
  server.use(authRoutes);
  server.use('/edit', restrictAccess);
  server.get('/edit/:slug', restrictAccess, (req, res) =>
    app.render(req, res, '/edit', { slug: req.params.slug })
  );
  server.get('/artifact', (req, res) => res.redirect('/edit'));
  server.get('/artifact/:slug', restrictAccess, (req, res) =>
    app.render(req, res, '/artifact', { slug: req.params.slug })
  );

  server.get('*', handle);

  http.createServer(server).listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
});
