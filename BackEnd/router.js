const express = require("express");
let UserAPI = require("./server/users");
let CarAPI = require("./server/cars");
let ReservationAPI = require("./server/reservations");
let AuthAPI = require("./server/auth");

function initialize() {
  let api = express();

  api.use("/userdb", UserAPI());
  api.use("/cardb", CarAPI());
  api.use("/reservationdb", ReservationAPI());
  api.use("/auth", AuthAPI());

  return api;
}

module.exports = {
  initialize: initialize,
};
