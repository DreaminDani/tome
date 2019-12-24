const dev = process.env.NODE_ENV !== 'production';
if (dev) {
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
} = require('./server/config');
const { ensureSecure, restrictAccess } = require('./server/helpers');

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // connect to database and make it available as 'db' in req
  const pool = new Pool({ connectionString });
  pool.on('error', (err, client) => {
    console.error(`Unexpected error on idle client: ${client}`, err);
    process.exit(-1);
  });
  server.set('db', pool);

  server.use(bodyParser.json());
  if (dev) {
    // hot reload backend routes (global requires will not reload automatically)
    //  https://codeburst.io/dont-use-nodemon-there-are-better-ways-fc016b50b45e
    // eslint-disable-next-line
    const chokidar = require('chokidar');
    const watcher = chokidar.watch('./server');

    watcher.on('ready', function() {
      watcher.on('all', function() {
        console.log('Detected change, clearing /server/ module cache.');
        Object.keys(require.cache).forEach(function(id) {
          if (
            /[\\]server[\\]/.test(id) &&
            !/[\\]next[\\]/.test(id) &&
            !/[\\].next[\\]/.test(id)
          ) {
            delete require.cache[id];
          }
        });
      });
    });
  } else if (typeof process.env.CI === 'undefined') {
    //  http://expressjs.com/en/4x/api.html#app.set
    // trust proxy provided headers, since we'll be
    //  running this behind load balancer / proxy
    server.enable('trust proxy');
    server.use(ensureSecure);
  }

  // enable test routes
  if (dev || process.env.CI) {
    server.use('/test', (req, res, next) => {
      require('./server/test-helpers.js')(req, res, next);
    });
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
  server.use('/api', (req, res, next) => {
    require('./server/api/artifact')(req, res, next);
  });

  // auth endpoints
  server.use((req, res, next) => {
    require('./server/auth')(req, res, next);
  });

  // frontend routes
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
