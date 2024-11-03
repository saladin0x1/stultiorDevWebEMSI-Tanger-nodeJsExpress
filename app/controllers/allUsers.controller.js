const db = require("../models");
const User = db.user;

// Controller to retrieve all users
exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users); // Send users as JSON response
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
};
