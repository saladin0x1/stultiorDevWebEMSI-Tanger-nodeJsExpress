// app/controllers/user.controller.js
const db = require("../models");  // Import the Sequelize models
const User = db.user;  // Assuming 'user' is your model for users

// Public route for all users
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

// User-specific route (requires token)
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

// Moderator-specific route (requires token + moderator role)
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

// Get all users (only accessible by Admin)
exports.allUsers = (req, res) => {
  User.findAll()  // Sequelize's 'findAll' method retrieves all users from the database
    .then(users => {
      res.status(200).json(users);  // Send back the users as JSON
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// Admin-specific route (requires token + admin role)
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
