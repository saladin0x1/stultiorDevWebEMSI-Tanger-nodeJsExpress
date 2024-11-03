const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

// MySQL configuration (commented out)
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

// SQLite configuration using the same config structure
// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: config.storage || "./database.sqlite", // Use config for storage or default to './database.sqlite'
//   pool: {
//     max: config.pool.max,
//     min: config.pool.min,
//     acquire: config.pool.acquire,
//     idle: config.pool.idle
//   }
// });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

// Define many-to-many relationship
db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

// Define roles
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
