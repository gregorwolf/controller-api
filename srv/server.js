"use strict";

const express = require("express");
const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");

// For authentication test
const passport = require("passport")
const xsenv = require("@sap/xsenv")
xsenv.loadEnv();
const JWTStrategy = require("@sap/xssec").JWTStrategy
const services = xsenv.getServices({ xsuaa: { tags: "xsuaa" }})
passport.use(new JWTStrategy(services.xsuaa))

const host = "0.0.0.0";
const port = process.env.PORT || 4004;

(async () => {
  const app = express();

  // Authentication using JWT
  await app.use(passport.initialize())
  await app.use(
    passport.authenticate('JWT', { session: false })
  )

  await app.get('/api/userInfo', function (req, res) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(req.user))
  })
  await app.get('/api/jwt', function (req, res) {
    const jwt = /^Bearer (.*)$/.exec(req.headers.authorization)[1]
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ "JWT": jwt }))
  })
  // serve odata v4
  await cds
    .connect("db") // ensure database is connected!
    .serve("all")
    .with('controller-service.js')
    .in(app);

  // serve odata v2
  process.env.XS_APP_LOG_LEVEL = "warning";
  app.use(proxy({
    path: "v2",
    port: port
  }));

  // start server
  const server = app.listen(port, host, () => console.info(`app is listing at ${host}:${port}`));
  server.on("error", error => console.error(error.stack));
})();