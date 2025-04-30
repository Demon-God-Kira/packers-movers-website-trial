const mysql = require("mysql2/promise");

let db;
try {
  db = mysql.createPool({
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
    const [rows] = await db.execute("SELECT 1");
    console.log("✅ Database connection successful.");
  })();
} catch (err) {
  console.warn("⚠️ Skipping database connection due to error:", err.message);
  db = null; // Fallback to no database
}

// Add a function to close the database connection
module.exports.closeConnection = async () => {
  if (db) {
    try {
      await db.end();
      console.log("\u2705 Database connection closed successfully.");
    } catch (err) {
      console.error("\u274c Error closing the database connection:", err.message);
    }
  } else {
    console.log("\u26a0 No database connection to close.");
  }
};

module.exports = db;
