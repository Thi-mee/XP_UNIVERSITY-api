const express = require('express');
const bodyparser = require("body-parser");
var cors = require("cors")
const app = express();

async function init() {
  app.use(bodyparser.json({ limit: "50mb" }));
  app.use(cors());
  app.use(
    bodyparser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000
    })
  );
  app.use((req, res, next)=> {
    console.log('\x1b[45m%s\x1b[0m', req.method, "\x1b[33m", req.url, "\x1b[0m");
    next();
  }) 
  const app_route = require("./modules/module");
  const app_modules = new app_route(app);
  app.get("/", (req, res) => {
    res.send("Welcome to Academics API");
  });
  app_modules.init();
}

init();
module.exports = app;

