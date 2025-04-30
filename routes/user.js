const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const db = require('../config/db'); // Ensure this imports the correct db object

// User Dashboard – Show user's orders
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const userId = req.session.user.id;

  try {
    // Fetch user details
    const [userResult] = await db.execute('SELECT name FROM users WHERE id = ?', [userId]);
    const userName = userResult[0]?.name || 'User';

    // Fetch total orders
    const [totalOrdersResult] = await db.execute('SELECT COUNT(*) AS totalOrders FROM orders WHERE user_id = ?', [userId]);
    const totalOrders = totalOrdersResult[0]?.totalOrders || 0;

    // Fetch current orders
    const [currentOrders] = await db.execute('SELECT * FROM orders WHERE user_id = ? AND status IN ("Pending", "In Progress")', [userId]);

    // Fetch past orders
    const [pastOrders] = await db.execute('SELECT * FROM orders WHERE user_id = ? AND status IN ("Completed", "Cancelled")', [userId]);

    // Render the dashboard view with the fetched data
    res.render('dashboard', {
      user: { ...req.session.user, name: userName },
      totalOrders,
      currentOrders: currentOrders || [],
      pastOrders: pastOrders || []
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Cancel an order
router.post('/dashboard/cancel-order/:id', ensureAuthenticated, async (req, res) => {
  const orderId = req.params.id;
  const userId = req.session.user.id;

  try {
    // Update the order status to "Cancelled"
    const sql = 'UPDATE orders SET status = "Cancelled" WHERE id = ? AND user_id = ?';
    const [result] = await db.execute(sql, [orderId, userId]);

    if (result.affectedRows > 0) {
      req.session.message = 'Order cancelled successfully.';
    } else {
      req.session.message = 'Failed to cancel the order. Please try again.';
    }

    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error cancelling order:', err.message);
    req.session.message = 'An error occurred while cancelling the order.';
    res.redirect('/dashboard');
  }
});

// Update an order
router.post('/dashboard/update-order', ensureAuthenticated, async (req, res) => {
  const { order_id, pickup_address, delivery_address } = req.body;
  const userId = req.session.user.id;

  try {
    const sql = 'UPDATE orders SET pickup_address = ?, delivery_address = ? WHERE id = ? AND user_id = ?';
    const [result] = await db.execute(sql, [pickup_address, delivery_address, order_id, userId]);

    if (result.affectedRows > 0) {
      req.session.message = 'Order updated successfully.';
    } else {
      req.session.message = 'Failed to update the order. Please try again.';
    }

    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error updating order:', err.message);
    req.session.message = 'An error occurred while updating the order.';
    res.redirect('/dashboard');
  }
});

module.exports = router;
