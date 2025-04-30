const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "kira", // Your MySQL password
  database: "packers_movers", // The name of your database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
(async () => {
  try {
    const [rows] = await db.execute("SELECT 1");
    console.log("✅ Database connection successful.");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error(err); // Log full error for debugging
    process.exit(1); // Exit the process if the connection fails
  }
})();

// Add a function to close the database connection
module.exports.closeConnection = async () => {
  try {
    await db.end();
    console.log("\u2705 Database connection closed successfully.");
  } catch (err) {
    console.error("\u274c Error closing the database connection:", err.message);
  }
};

module.exports = db;
