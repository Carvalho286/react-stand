const bodyParser = require("body-Parser");
const express = require("express");
const multer = require("multer");
const Cars = require("../data/cars");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const cookieParser = require("cookie-parser");
const verifyToken = require("../middleware/token");

function CarRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.json({ limit: "100mb", extended: true }));

  router.use(cookieParser());
  router.use(verifyToken);

  router
    .route("/cars")
    .get(
      Users.authorize([
        scopes["read-all"],
        scopes["read-posts"],
        scopes["manage-posts"],
      ]),
      function (req, res, next) {
        Cars.findAll()
          .then((cars) => {
            res.send(cars);
            next();
          })
          .catch((err) => {
            next();
          });
      }
    )
    .post(
      Users.authorize([scopes["read-all"], scopes["manage-posts"]]),
      function (req, res, next) {
        let body = req.body;
        Cars.create(body)
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

  router
    .route("/car/:carId")
    .get(
      Users.authorize([
        scopes["read-all"],
        scopes["read-posts"],
        scopes["manage-posts"],
      ]),
      function (req, res, next) {
        let carId = req.params.carId;
        Cars.findById(carId)
          .then((car) => {
            res.status(200);
            res.send(car);
            next();
          })
          .catch((err) => {
            res.status(404);
            next();
          });
      }
    )
    .put(Users.authorize([scopes["read-all"]]), function (req, res, next) {
      let carId = req.params.carId;
      let body = req.body;

      Cars.update(carId, body)
        .then((car) => {
          res.status(200);
          res.send(car);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .delete(Users.authorize([scopes["read-all"]]), function (req, res, next) {
      let carId = req.params.carId;
      Cars.removeById(carId)
        .then(() => {
          res.send("Apagado com sucesso");
          res.status(200).json();
          next();
        })
        .catch((err) => {
          console.log(err);
          res.status(404);
          next();
        });
    });

  router
    .route("/car/marca/:carMarca")
    .get(
      Users.authorize([
        scopes["read-all"],
        scopes["read-posts"],
        scopes["manage-posts"],
      ]),
      function (req, res, next) {
        let carMarca = req.params.carMarca;

        Cars.findByMarca(carMarca)
          .then((car) => {
            res.status(200);
            res.send(car);
            next();
          })
          .catch((err) => {
            res.status(404);
            next();
          });
      }
    );

  return router;
}
module.exports = CarRouter;
