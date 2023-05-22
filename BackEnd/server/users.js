const bodyParser = require("body-Parser");
const express = require("express");
const { decode } = require("jsonwebtoken");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/token");
const cookieParser = require("cookie-parser");

function UserRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.use(cookieParser());
  router.use(VerifyToken);
  router
    .route("/users")
    .get(
      Users.authorize([
        scopes["read-all"],
        scopes["read-posts"],
        scopes["manage-posts"],
      ]),
      function (req, res, next) {
        Users.findAll()
          .then((users) => {
            res.send(users);
            next();
          })
          .catch((err) => {
            next();
          });
      }
    );

  router
    .route("/users/:userId")
    .get(
      Users.authorize([
        scopes["read-all"],
        scopes["read-posts"],
        scopes["manage-posts"],
      ]),
      function (req, res, next) {
        let userId = req.params.userId;

        Users.findById(userId)
          .then((lol) => {
            res.status(200);
            res.send(lol);
            next();
          })
          .catch((err) => {
            res.status(404);
            next();
          });
      }
    )
    //meter para encriptar a password no update
    .put(Users.authorize([scopes["read-all"]]), function (req, res, next) {
      let userId = req.params.userId;
      let body = req.body;
      Users.update(userId, body)
        .then((user) => {
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .delete(Users.authorize([scopes["read-all"]]), function (req, res, next) {
      let userId = req.params.userId;
      Users.removeById(userId)
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

  return router;
}
module.exports = UserRouter;
