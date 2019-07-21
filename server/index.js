const dev = process.env.NODE_ENV !== "production";
if (dev) {
  require("dotenv").config();
}

const express = require("express");
const http = require("http");
const next = require("next");
const session = require("express-session");
const passport = require("passport");
const { Pool } = require('pg');

const { sessionConfig, auth0Strategy, connectionString } = require("./config");
const { restrictAccess } = require("./helpers");

const authRoutes = require("./auth-routes");
const thoughtsAPI = require("./thoughts-api");

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const pool = new Pool({connectionString: connectionString,});
  pool.on('error', (err, client) => {
    console.error(`Unexpected error on idle client: ${client}`, err)
    process.exit(-1)
  })
  server.set("db", pool);

  // auth config
  server.use(session(sessionConfig));
  passport.use(auth0Strategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  server.use(passport.initialize());
  server.use(passport.session());

  // routes
  server.use(authRoutes);
  server.use(thoughtsAPI);
  server.use("/", restrictAccess);
  server.get("*", handle);

  http.createServer(server).listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
});