const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// User Dashboard – Show user's orders
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    // Render the dashboard view
    res.render('dashboard', {
      user: req.session.user,
      totalOrders: 0,
      currentOrders: [],
      pastOrders: []
    });
  } catch (err) {
    console.error('Error rendering dashboard:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Cancel an order
router.post('/dashboard/cancel-order/:id', ensureAuthenticated, async (req, res) => {
  try {
    req.session.message = 'Order cancelled successfully.';
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error cancelling order:', err.message);
    req.session.message = 'An error occurred while cancelling the order.';
    res.redirect('/dashboard');
  }
});

// Update an order
router.post('/dashboard/update-order', ensureAuthenticated, async (req, res) => {
  try {
    req.session.message = 'Order updated successfully.';
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error updating order:', err.message);
    req.session.message = 'An error occurred while updating the order.';
    res.redirect('/dashboard');
  }
});

module.exports = router;
