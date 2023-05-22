let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let reservationSchema = new Schema({
  car: [
    {
      type: Schema.Types.ObjectId,
      ref: "cars",
      required: true,
      unique: false,
    },
  ],
  client: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: false,
    },
  ],
  request: {
    type: "Date",
    default: Date.now(),
    //expires: ,
  },
  from: {
    type: "Date",
    required: true,
  },
  days: {
    type: "Number",
    required: true,
  },
});

let reservation = mongoose.model("Reservation", reservationSchema);

module.exports = reservation;
