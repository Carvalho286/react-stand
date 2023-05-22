const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");
const cookieParser = require("cookie-parser");
const verifyToken = require("../middleware/token");

function AuthRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.json({ limit: "100mb", extended: true }));

  router.route("/register").post(function (req, res, next) {
    const body = req.body;

    Users.create(body)
      .then((response) => {
        res.status(200);
        res.send(response);
      })
      .catch((error) => {
        res.sendStatus(500);
        res.send(error);
        console.log(error.status);
        next();
      });
  });

  router.route("/me").get(function (req, res, next) {
    let token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }

    return Users.verifyToken(token)
      .then((decoded) => {
        res.status(202).send({ auth: true, decoded });
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
        console.log(err);
        next();
      });
  });

  router.route("/login").post(function (req, res, next) {
    let body = req.body;

    return Users.findUser(body)
      .then((user) => {
        return Users.createToken(user);
      })
      .then((login) => {
        res.cookie("token", login.token, { httpOnly: true });
        res.status(200);
        res.send(login);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500);
        res.send(err);
        next();
      });
  });

  router.use(cookieParser());
  router.use(verifyToken);

  router.route("/logout").get(function (req, res, next) {
    res.cookie("token", req.cookies.token, { httpOnly: true, maxAge: 0 });
    res.status(200);
    res.send({ logout: true });
    next();
  });

  router.use(cookieParser());
  router.use(verifyToken);

  router.route("/whoami").get(function (req, res, next) {
    let token = req.cookies.token;

    Users.verifyToken(token)
      .then((decoded) => {
        res.send(decoded);
        next();
      })
      .catch(() => {
        res.status(401).send({ auth: false, message: "Not authorized" });
      });
  });

  return router;
}

module.exports = AuthRouter;
