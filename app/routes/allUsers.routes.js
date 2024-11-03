module.exports = (app) => {
  const allUsers = require("../controllers/allUsers.controller");

  // Route to get all users
  app.get("/api/users/all", allUsers.findAllUsers);
};
