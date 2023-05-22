const Cars = require("./car");
const CarService = require("./service");

const service = new CarService(Cars);

module.exports = service;
