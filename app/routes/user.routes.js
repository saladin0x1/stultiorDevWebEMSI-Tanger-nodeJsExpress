// app/routes/user.routes.js
const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  // CORS configuration (Optional if you're using the 'cors' package globally)
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Public route accessible to all users
  app.get("/api/test/all", controller.allAccess);

  // Protected route: Accessible to users with a valid token
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // Protected route: Accessible to users with a valid token and Moderator role
  app.get("/api/test/mod", [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);

  // Admin-only route: Accessible to users with a valid token and Admin role
  app.get("/api/users/all", [authJwt.verifyToken, authJwt.isAdmin], controller.allUsers);

  // Admin route to test admin access
  app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
};
