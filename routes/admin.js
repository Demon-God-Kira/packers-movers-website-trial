const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const db = require('../config/db'); // Ensure this imports the correct db object

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.status(403).send('Access denied');
};

// Admin dashboard – Show all orders
router.get('/admin-dashboard', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    // Fetch total orders
    const [totalOrdersResult] = await db.execute('SELECT COUNT(*) AS totalOrders FROM orders');
    const totalOrders = totalOrdersResult[0]?.totalOrders || 0;

    // Fetch moved orders
    const [movedOrdersResult] = await db.execute('SELECT COUNT(*) AS movedOrders FROM orders WHERE status = "Completed"');
    const movedOrders = movedOrdersResult[0]?.movedOrders || 0;

    // Fetch pending orders
    const [pendingOrdersResult] = await db.execute('SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = "Pending"');
    const pendingOrders = pendingOrdersResult[0]?.pendingOrders || 0;

    // Fetch all orders
    const [orders] = await db.execute('SELECT * FROM orders');

    // Render the admin dashboard view
    res.render('admin-dashboard', {
      totalOrders,
      movedOrders,
      pendingOrders,
      orders
    });
  } catch (err) {
    console.error('Error fetching admin dashboard data:', err.message);
    res.status(500).send('Server error');
  }
});

// Admin logs page
router.get('/admin-logs', ensureAuthenticated, isAdmin, async (req, res) => {
  const sql = 'SELECT * FROM admin_logs ORDER BY created_at DESC';

  try {
    const [results] = await db.execute(sql);
    res.render('admin-logs', { logs: results });
  } catch (err) {
    console.error('Error fetching admin logs:', err);
    res.status(500).send('Server error');
  }
});

// Update order status
router.post('/admin/update-order-status/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  try {
    await db.execute(sql, [status, orderId]);
    res.redirect('/admin-dashboard');
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).send('Server error');
  }
});

// Update order status
router.post('/admin-dashboard/update-order-status/:id', async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    // Update the order status in the database
    await Order.update({ status }, { where: { id: orderId } });
    res.redirect('/admin-dashboard'); // Redirect back to the admin dashboard
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/update-order-status/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    // Update the order status in the database
    const sql = 'UPDATE orders SET status = ? WHERE id = ?';
    const [result] = await db.execute(sql, [status, orderId]);

    if (result.affectedRows > 0) {
      console.log(`Order #${orderId} status updated to ${status}`);
    } else {
      console.error(`Failed to update status for Order #${orderId}`);
    }

    res.redirect('/admin/admin-dashboard'); // Redirect back to the admin dashboard
  } catch (err) {
    console.error('Error updating order status:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
