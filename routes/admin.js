const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.status(403).send('Access denied');
};

// Admin dashboard – Show all orders
router.get('/admin-dashboard', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin-dashboard', {
    totalOrders: 0,
    movedOrders: 0,
    pendingOrders: 0,
    orders: []
  });
});

// Admin logs page
router.get('/admin-logs', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('admin-logs', { logs: [] });
});

// Update order status
router.post('/admin/update-order-status/:id', ensureAuthenticated, isAdmin, (req, res) => {
  res.redirect('/admin-dashboard');
});

// Update order status
router.post('/admin-dashboard/update-order-status/:id', (req, res) => {
  res.redirect('/admin-dashboard'); // Redirect back to the admin dashboard
});

router.post('/update-order-status/:id', ensureAuthenticated, isAdmin, (req, res) => {
  res.redirect('/admin/admin-dashboard'); // Redirect back to the admin dashboard
});

module.exports = router;
