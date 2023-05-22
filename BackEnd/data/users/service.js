const config = require("../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const scopes = require("./scopes");

function UserService(UserModel) {
  let service = {
    create,
    createToken,
    verifyToken,
    findUser,
    findAll,
    findById,
    update,
    removeById,
    authorize,
  };

  function create(user) {
    return createPassword(user).then((hashPassword, err) => {
      if (err) {
        return Promise.reject("Não salvo");
      }

      let newUserWithPassword = {
        ...user,
        password: hashPassword,
      };

      let newUser = UserModel(newUserWithPassword);
      return save(newUser);
    });
  }

  function save(newUser) {
    return new Promise(function (resolve, reject) {
      newUser.save(function (err) {
        if (err) reject(err);
        resolve("Utilizador criado com sucesso");
      });
    });
  }

  function createToken(user) {
    let token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role.scopes,
      },
      config.secret,
      {
        expiresIn: config.expiresPassword,
      }
    );

    return {
      auth: true,
      token,
    };
  }

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject();
        }
        return resolve(decoded);
      });
    });
  }

  function findUser({ email, password }) {
    return new Promise(function (resolve, reject) {
      UserModel.findOne({ email }, function (err, user) {
        if (err) reject(err);

        if (!user) {
          reject("A informação está errada");
        }

        resolve(user);
      });
    }).then((user) => {
      return comparePassword(password, user.password).then((match) => {
        if (!match) return Promise.reject("Utilizador inválido");
        return Promise.resolve(user);
      });
    });
  }

  function createPassword(user) {
    return bcrypt.hash(user.password, config.saltRounds);
  }

  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  function authorize(scopes) {
    return (request, response, next) => {
      const { roleUser } = request;
      const hasAutorization = scopes.some((scope) => roleUser.includes(scope));

      if (roleUser && hasAutorization) {
        next();
      } else {
        response.status(403).json({ message: "Proibido" });
      }
    };
  }

  function findAll() {
    return new Promise(function (resolve, reject) {
      UserModel.find({}, function (err, users) {
        if (err) reject(err);
        resolve(users);
      });
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      UserModel.findById(id, function (err, user) {
        if (err) reject(err);
        resolve(user);
      });
    });
  }

  function update(id, user) {
    return createPassword(user).then((hashPassword, err) => {
      if (err) {
        return Promise.reject("Nao salvo");
      }

      let newUserWithPassword = {
        ...user,
        password: hashPassword,
      };

      let newUser = newUserWithPassword;
      return secondUpdate(id, newUser);
    });
  }

  function secondUpdate(id, newUser) {
    return new Promise(function (resolve, reject) {
      UserModel.findByIdAndUpdate(id, newUser, function (err, lol) {
        if (err) {
          reject(err);
        } else {
          resolve("Utilizador atualizado com sucesso " + lol);
        }
      });
    });
  }

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      UserModel.findByIdAndRemove(id, function (err) {
        console.log(err);
        if (err) reject(err);
        resolve();
      });
    });
  }

  return service;
}

module.exports = UserService;
