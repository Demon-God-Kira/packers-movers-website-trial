const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// User Dashboard – Show user's orders
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  try {
    // Dummy data for the dashboard
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
