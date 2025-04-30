const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');

// Route to render order page (GET)
router.get('/', isLoggedIn, (req, res) => {
  const message = req.session.message || null; // Retrieve message from session
  req.session.message = null; // Clear the message after retrieving it
  res.render('order', { user: req.session.user || null, message });
});

// Route to handle order submission (POST)
router.post('/', isLoggedIn, (req, res) => {
  const { name, email, phone, pickup_state, pickup_city, pickup_address, delivery_state, delivery_city, delivery_address, pickup_date, arriving_date, packing_type, items, additional_notes, insurance } = req.body;

  // Dummy order placement logic
  console.log(`Order placed: ${name}, ${email}, ${pickup_address} to ${delivery_address}`);
  req.session.message = 'Order placed successfully!';
  res.redirect('/');
});

module.exports = router;
