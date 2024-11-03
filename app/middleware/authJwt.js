const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]; // Get the token from the request headers

  if (!token) {
    console.log("No token provided in the request."); // Log absence of token
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  // Log the secret key used for token verification
  console.log("JWT Secret Key during token verification:", config.secret);

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log("Token verification error:", err.message); // Log verification errors
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id; // Set user ID from decoded token
    console.log("Token verified successfully. User ID:", req.userId); // Log successful verification
    next();
  });
};

// Middleware to check if the user has an Admin role
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      console.log("User not found for ID:", req.userId); // Log if user is not found
      return res.status(404).send({ message: "User not found." });
    }

    const roles = await user.getRoles();
    const isAdmin = roles.some(role => role.name === "admin"); // Check if the user has the admin role

    if (isAdmin) {
      console.log("User is admin."); // Log if user is admin
      return next();
    }

    console.log("User does not have admin role."); // Log if user is not admin
    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    console.error("Error validating user role:", error.message); // Log errors during role validation
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

// Middleware to check if the user has a Moderator role
const isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      console.log("User not found for ID:", req.userId); // Log if user is not found
      return res.status(404).send({ message: "User not found." });
    }

    const roles = await user.getRoles();
    const isModerator = roles.some(role => role.name === "moderator"); // Check if the user has the moderator role

    if (isModerator) {
      console.log("User is moderator."); // Log if user is moderator
      return next();
    }

    console.log("User does not have moderator role."); // Log if user is not moderator
    return res.status(403).send({
      message: "Require Moderator Role!",
    });
  } catch (error) {
    console.error("Error validating moderator role:", error.message); // Log errors during moderator role validation
    return res.status(500).send({
      message: "Unable to validate Moderator role!",
    });
  }
};

// Middleware to check if the user has either Moderator or Admin role
const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      console.log("User not found for ID:", req.userId); // Log if user is not found
      return res.status(404).send({ message: "User not found." });
    }

    const roles = await user.getRoles();
    const isModerator = roles.some(role => role.name === "moderator");
    const isAdmin = roles.some(role => role.name === "admin");

    if (isModerator || isAdmin) {
      console.log("User is either moderator or admin."); // Log if user has either role
      return next();
    }

    console.log("User does not have required moderator or admin role."); // Log if user does not have required roles
    return res.status(403).send({
      message: "Require Moderator or Admin Role!",
    });
  } catch (error) {
    console.error("Error validating moderator or admin role:", error.message); // Log errors during role validation
    return res.status(500).send({
      message: "Unable to validate Moderator or Admin role!",
    });
  }
};

// Export the middleware functions
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};

module.exports = authJwt;
