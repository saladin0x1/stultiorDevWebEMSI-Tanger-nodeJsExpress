const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require("path"); // Required to manipulate file paths
const requestLogger = require("./app/middleware/requestLogger"); // Import the request logger

const app = express();

// Enable CORS
app.use(cors());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:8081"],
  })
);

// Parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie session middleware
app.use(
  cookieSession({
    name: "dumber-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: false,
    sameSite: 'strict',
  })
);

// Use request logger middleware
app.use(requestLogger); // Apply the request logger middleware

// Database initialization
const db = require("./app/models");
const Role = db.role;

// Check if we should drop and resync the database
const shouldClearDatabase = process.env.CLEAR_DB === 'true';

const syncDatabase = async () => {
  try {
    if (shouldClearDatabase) {
      console.log('\n--- Clearing Database ---');
      await db.sequelize.sync({ force: true }); // Clear and resync the database
      console.log('Database cleared and resynced successfully.');
    } else {
      await db.sequelize.sync();
      console.log('Database synchronized successfully.');
    }
    // console.log(`Database file located at: ${path.resolve(db.sequelize.options.storage)}`); // Show database file path
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDatabase();

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Everything is Good !!!" });
});

// Routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/allUsers.routes")(app); // New route for /api/users/all

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n--- Server Status ---`);
  console.log(`Server is running on port ${PORT}.\n`);
});

// Initial function to create roles
function initial() {
  Role.create({ id: 1, name: "user" }).then(() => {
    console.log('Role "user" created.');
  }).catch((error) => {
    console.error('Error creating role "user":', error);
  });

  Role.create({ id: 2, name: "moderator" }).then(() => {
    console.log('Role "moderator" created.');
  }).catch((error) => {
    console.error('Error creating role "moderator":', error);
  });

  Role.create({ id: 3, name: "admin" }).then(() => {
    console.log('Role "admin" created.');
  }).catch((error) => {
    console.error('Error creating role "admin":', error);
  });
}

// Call initial to create roles if necessary
// initial();
