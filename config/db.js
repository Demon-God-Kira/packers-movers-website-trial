const mysql = require("mysql2/promise");

// Ensure the application continues to run even if the database connection fails
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
  console.warn("⚠️ Database connection failed. Running without a database:", err.message);
  db = null; // Fallback to no database
}

module.exports = db || {
  execute: async () => {
    console.warn("⚠️ Database is not connected. Returning dummy data.");
    return [[], []]; // Return empty results for queries
  },
  end: async () => {
    console.warn("⚠️ No database connection to close.");
  }
};
