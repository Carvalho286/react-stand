const { response } = require("express");
var mongoose = require("mongoose");

function ReservationService(ReservationModel) {
  let service = {
    create,
    findAll,
    beforeCheck,
  };

  function create(values) {
    let newReservation = ReservationModel(values);
    return save(newReservation);
  }

  function beforeCheck() {
    return (request, response, next) => {
      const values = request.body;
      let newReservation = ReservationModel(values);
      return check(newReservation)
        .then((newReservation) => {
          next();
        })
        .catch((err) => {
          response.status(403).json({ message: "Erro por causa da data" });
        });
    };
  }

  function save(newReservation) {
    return new Promise(function (resolve, reject) {
      newReservation.save(function (err) {
        if (err) reject(err);
        resolve("Reserva criada com sucesso");
      });
    });
  }

  function findAll() {
    return new Promise(function (resolve, reject) {
      ReservationModel.find({}, function (err, reservations) {
        if (err) reject(err);
        resolve(reservations);
      });
    });
  }

  function check(newReservation) {
    return new Promise(function (resolve, reject) {
      ReservationModel.find({}, function (err, reservations) {
        if (reservations.length > 0) {
          if (err) reject(err);
          reservations.forEach(myFunction);
          function myFunction(reservations) {
            if ((reservations.car = newReservation.car)) {
              let date = reservations.from;
              let days = reservations.days;
              var result = new Date(date);
              result.setDate(result.getDate() + days);
              if (Date.parse(newReservation.from) >= Date.parse(result)) {
                resolve(newReservation);
              } else {
                reject("Nao da");
              }
            } else {
              console.log("fds nao da esta merda pqp");
            }
          }
        } else {
          resolve(newReservation);
        }
      });
    });
  }
  return service;
}

module.exports = ReservationService;
