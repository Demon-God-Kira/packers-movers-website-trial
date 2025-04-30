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

// Fix the registration route to handle errors and success properly
router.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body;

  // Validate input
  if (!name || !email || !phone || !password) {
    return res.render('register', { user: null, error: 'All fields are required.', success: null });
  }

  // Dummy registration logic
  console.log(`Dummy registration: ${name}, ${email}, ${phone}`);
  res.render('register', { user: null, error: null, success: 'Registration successful! You can now log in.' });
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
  const dummyUser = req.session.user || { name: 'Guest User' };
  const dummyTotalOrders = 5;
  const dummyCurrentOrders = [
    { id: 1, pickup_address: '123 Street A', delivery_address: '456 Street B', status: 'In Progress', created_at: new Date() },
    { id: 2, pickup_address: '789 Street C', delivery_address: '101 Street D', status: 'Pending', created_at: new Date() }
  ];
  const dummyPastOrders = [
    { id: 3, pickup_address: '111 Street E', delivery_address: '222 Street F', status: 'Completed', updated_at: new Date() },
    { id: 4, pickup_address: '333 Street G', delivery_address: '444 Street H', status: 'Cancelled', updated_at: new Date() }
  ];

  res.render('dashboard', {
    user: dummyUser,
    totalOrders: dummyTotalOrders,
    currentOrders: dummyCurrentOrders,
    pastOrders: dummyPastOrders
  });
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
router.get("/user", (req, res) => {
  const dummyUser = { email: req.query.email || 'guest@example.com', name: 'Guest User' };
  res.json(dummyUser);
});

// Example route: Add a new order
router.post("/orders", (req, res) => {
  const dummyOrderId = Math.floor(Math.random() * 1000);
  res.status(201).json({ message: "Order added successfully", orderId: dummyOrderId });
});

// Example route: Update order status
router.put("/orders/:id/status", (req, res) => {
  res.json({ message: "Order status updated successfully" });
});

// Example route: Delete an order
router.delete("/orders/:id", (req, res) => {
  res.json({ message: "Order deleted successfully" });
});

// Example route: Get all orders
router.get("/orders", (req, res) => {
  const dummyOrders = [
    { id: 1, pickup_address: '123 Street A', delivery_address: '456 Street B', status: 'In Progress' },
    { id: 2, pickup_address: '789 Street C', delivery_address: '101 Street D', status: 'Pending' }
  ];
  res.json(dummyOrders);
});

module.exports = router;
