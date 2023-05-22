let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let carSchema = new Schema({
  vin: {
    //Vehicle Identification Number, Numero de Chassis
    type: "String",
    required: true,
    unique: true,
  },
  // carImage: {
  //   type: "String",
  //   required: true,
  // },
  marca: {
    type: "String",
    required: true,
  },
  modelo: {
    type: "String",
    required: true,
  },
  preco: {
    type: "Number",
    required: true,
  },
  lotacao: {
    type: "Number",
    required: true,
  },
  motor: {
    type: "String",
    required: true,
  },
  caixa: {
    type: "String",
    required: true,
  },
  portas: {
    type: "Number",
    required: true,
  },
  malaP: {
    type: "Number",
    required: false,
  },
  malaG: {
    type: "Number",
    required: false,
  },
  ac: {
    type: "Boolean",
    required: true,
    default: true,
  },
  experiencia: {
    type: "Number",
    required: true,
    min: 1,
  },
  disponibilidade: {
    type: "Boolean",
    required: true,
    default: true,
  },
});

let car = mongoose.model("Car", carSchema);

module.exports = car;
