const bodyParser = require("body-Parser");
const express = require("express");
const Reservations = require("../data/reservations");
const Users = require("../data/users");
const Cars = require("../data/cars");
const scopes = require("../data/users/scopes");
const cookieParser = require("cookie-parser");
const verifyToken = require("../middleware/token");

function ReservationRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.json({ limit: "100mb", extended: true }));

  router.use(cookieParser());
  router.use(verifyToken);

  router
    .route("/reservations")
    .get(
      Users.authorize([
        scopes["read-all"],
        scopes["read-posts"],
        scopes["manage-posts"],
      ]),
      function (req, res, next) {
        Reservations.findAll()
          .then((reservations) => {
            res.send(reservations);
            next();
          })
          .catch((err) => {
            next();
          });
      }
    )
    .post(
      Users.authorize([
        scopes["read-all"],
        scopes["manage-posts"],
        scopes["read-posts"],
      ]),
      Reservations.beforeCheck(),
      Cars.changeDisponibilidadeToFalse(),
      function (req, res, next) {
        let body = req.body;
        Reservations.create(body)
          .then(() => {
            res.status(200);
            res.send(body);
            next();
          })
          .catch((err) => {
            console.log(err.message);
            err.status = err.status || 500;
            res.status(401);
            next();
          });
      }
    );

  return router;
}

module.exports = ReservationRouter;
