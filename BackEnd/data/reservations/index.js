const Reservations = require("./reservation");
const ReservationService = require("./service");

const service = new ReservationService(Reservations);

module.exports = service;
