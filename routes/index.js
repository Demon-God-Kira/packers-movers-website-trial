const express = require("express");
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  const message = req.session.message;
  req.session.message = null; // Clear the message after displaying it
  res.render('index', { user: req.session.user || null, message });
});

// Login page with redirect handling
router.get('/login', (req, res) => {
  const redirect = req.query.redirect || '/';
  res.render('login', { user: null, error: null, redirect });
});

// Registration page
router.get('/register', (req, res) => {
  res.render('register', { user: null, error: null, success: null });
});

// Handle registration logic
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.render('register', { user: null, error: 'All fields are required.', success: null });
    }

    const query = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, email, phone, password]);

    if (result.affectedRows > 0) {
      console.log(`✅ User registered successfully: ID ${result.insertId}`);
      res.redirect('/login');
    } else {
      console.error("❌ Registration failed: No rows affected.");
      res.render('register', { user: null, error: 'Registration failed. Please try again.', success: null });
    }
  } catch (err) {
    console.error("❌ Error during registration:", err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      res.render('register', { user: null, error: 'Email already exists.', success: null });
    } else {
      res.render('register', { user: null, error: 'An unexpected error occurred. Please try again.', success: null });
    }
  }
});

// Handle login logic
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Dummy login logic
  req.session.user = { email, isAdmin: false }; // Assume all users are non-admin
  res.redirect(req.body.redirect || '/dashboard');
});

// Handle "Get a Quote" button
router.get('/get-a-quote', (req, res) => {
  if (!req.session.user) {
    // Redirect to login page with a redirect query parameter
    return res.redirect('/login?redirect=/order');
  }
  // If logged in, redirect to the order page
  res.redirect('/order');
});

// Dashboard page
router.get('/dashboard', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;

  try {
    // Fetch total orders
    const [totalOrdersResult] = await db.execute('SELECT COUNT(*) AS totalOrders FROM orders WHERE user_id = ?', [userId]);
    const totalOrders = totalOrdersResult[0]?.totalOrders || 0;

    // Fetch current orders
    const [currentOrders] = await db.execute('SELECT * FROM orders WHERE user_id = ? AND status = "In Progress"', [userId]);

    // Fetch past orders
    const [pastOrders] = await db.execute('SELECT * FROM orders WHERE user_id = ? AND status = "Completed"', [userId]);

    // Render the dashboard view with the fetched data
    res.render('dashboard', {
      user: req.session.user,
      totalOrders,
      currentOrders: currentOrders || [],
      pastOrders: pastOrders || []
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Order page
router.get('/order', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const message = req.session.message || null; // Retrieve message from session
  req.session.message = null; // Clear the message after retrieving it
  res.render('order', { user: req.session.user, message });
});

// Logout
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Example route: Get user by email
router.get("/user", async (req, res) => {
  try {
    const user = await db.getUserByEmail(req.query.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Example route: Add a new order
router.post("/orders", async (req, res) => {
  try {
    const orderId = await db.addOrder(req.body);
    res.status(201).json({ message: "Order added successfully", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add order" });
  }
});

// Example route: Update order status
router.put("/orders/:id/status", async (req, res) => {
  try {
    await db.updateOrderStatus(req.params.id, req.body.status);
    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Example route: Delete an order
router.delete("/orders/:id", async (req, res) => {
  try {
    await db.deleteOrder(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Example route: Get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await db.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
