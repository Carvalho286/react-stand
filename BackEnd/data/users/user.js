let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let scopes = require("./scopes");

let roleSchema = new Schema({
  name: { type: String, required: true },
  scopes: [
    {
      type: String,
      enum: [scopes["read-all"], scopes["read-posts"], scopes["manage-posts"]],
    },
  ],
});

let userSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  role: {
    type: roleSchema,
    required: true,
    default: {
      name: "Client",
      scopes: ["read-posts"],
    },
  },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
});

let user = mongoose.model("User", userSchema);

module.exports = user;
