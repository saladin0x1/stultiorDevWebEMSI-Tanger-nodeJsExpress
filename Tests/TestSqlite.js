const { Sequelize } = require("sequelize");
const config = require("../app/config/db.config.js");
const db = require("../app/models/index.js");

// Initialize the Sequelize instance for SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: config.storage || "./database.sqlite",
});

// Test the database connection and model synchronization
const testDatabase = async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log("Connection to the SQLite database has been established successfully.");

        // Synchronize models with the database
        await db.sequelize.sync({ force: true });
        console.log("Database synchronized successfully.");

        // Create roles and ensure we get the correct instances
        const userRole = await db.role.create({ name: "user" });
        const adminRole = await db.role.create({ name: "admin" });
        console.log("Roles created:", userRole.name, adminRole.name);

        // Create a user
        const user = await db.user.create({
            username: "testuser",
            email: "test@example.com",
            password: "password123"
        });
        console.log("User created:", user.username);

        // Ensure the role instances are being correctly used
        await user.addRole(userRole.id);  // Use the role ID directly
        console.log(`Role '${userRole.name}' assigned to user '${user.username}'.`);

        // Fetch user with roles
        const fetchedUser = await db.user.findOne({
            where: { username: "testuser" },
            include: db.role // Include roles in the fetched user
        });

        if (fetchedUser && fetchedUser.roles) {
            console.log(`Fetched User: ${fetchedUser.username}, Roles: ${fetchedUser.roles.map(r => r.name).join(', ')}`);
        } else {
            console.log("No roles found for the fetched user.");
        }
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    } finally {
        await sequelize.close(); // Close the connection
    }
};

testDatabase();
