"use strict";

const express = require("express");
const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
const csn = 'srv/srv/csn.json';

const host = "0.0.0.0";
const port = process.env.PORT || 4004;

(async () => {
  const app = express();

  app.use("/", express.static("app/resources/"))

  app.get("/", function(req, res) {
    res.redirect("/index.html")
  });
  // serve odata v4
  await cds
    .serve('ControllerService')
    .from(csn)
    .with('./srv/controller-service')
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