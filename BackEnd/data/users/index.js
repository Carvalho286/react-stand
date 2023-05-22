const Users = require("./user");
const UserService = require("./service");

const service = new UserService(Users);

module.exports = service;
