// app/controllers/allUsers.controller.js
const db = require("../models");
const User = db.user; // Assuming you have a 'user' model

// Define the function to retrieve all users
exports.findAllUsers = (req, res) => {
  User.find({})
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
