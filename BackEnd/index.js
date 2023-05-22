const config = require("./config");
const express = require("express");
const http = require("http");
var mongoose = require("mongoose");
const multer = require("multer");

const hostname = "localhost";
const port = 3000;
let router = require("./router");

var app = express();
app.use(router.initialize());
const server = http.Server(app);
mongoose
  .connect(config.db)
  .then(() => console.log("Connection Successfull"))
  .catch((err) => console.error(err));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
