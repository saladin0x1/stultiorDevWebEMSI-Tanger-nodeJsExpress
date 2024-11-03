// Import required modules and models
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import the request logger middleware
const requestLogger = require("../middleware/requestLogger"); // Adjust the path accordingly

// User registration (signup) function
exports.signup = async (req, res) => {
  console.log("Incoming Signup Request:", JSON.stringify(req.body, null, 2));

  try {
    // Create new user with hashed password
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log("User created:", user.username);

    // Assign roles if specified in request
    let roles = req.body.roles ? await Role.findAll({
      where: {
        name: {
          [Op.or]: req.body.roles,
        },
      },
    }) : [await Role.findOne({ where: { id: 1 } })]; // Default role

    await user.setRoles(roles);
    console.log("Roles assigned:", roles.map(role => role.name));

    return res.status(201).send({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).send({ message: "Error occurred during registration: " + error.message });
  }
};

// User login (signin) function
exports.signin = async (req, res) => {
  console.log("Incoming Signin Request:", JSON.stringify(req.body, null, 2));

  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user) {
      console.log("User not found:", req.body.username);
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      console.log("Invalid password attempt for user:", user.username);
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: 'HS256',
      expiresIn: 86400, // 24 hours
    });
    console.log("Generated token:", token);

    req.session.token = token; // Store token in session

    // Prepare user roles for response
    const authorities = (await user.getRoles()).map(role => "ROLE_" + role.name.toUpperCase());
    console.log("User roles:", authorities);

    const response = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    };
    console.log("Response sent to client:", JSON.stringify(response, null, 2));

    return res.status(200).send(response);
  } catch (error) {
    console.error("Signin error:", error.message);
    return res.status(500).send({ message: "Error occurred during signin: " + error.message });
  }
};

// User signout function
exports.signout = async (req, res) => {
  try {
    req.session = null; // Clear session data to sign out the user
    console.log("User signed out.");
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    console.error("Signout error:", err.message);
    return res.status(500).send({ message: "Error during signout: " + err.message });
  }
};

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const token = req.session.token;

  console.log("Token received for verification:", token); // Log the received token

  if (!token) {
    console.log("No token provided!");
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id; // Set user ID from decoded token
    next();
  });
};

// Export the functions for use in your app
module.exports = {
  signup: exports.signup,
  signin: exports.signin,
  signout: exports.signout,
  verifyToken: exports.verifyToken,
  requestLogger, // Optional if you want to keep it for specific logging
};
