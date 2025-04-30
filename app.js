const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Store in env variable for production
  resave: false,
  saveUninitialized: false
}));

// Ensure the correct db object is used in all routes
app.use('/', require('./routes/index')); // Home, Login, Register
app.use('/order', require('./routes/order')); // Order placement
app.use('/user', require('./routes/user')); // User dashboard
app.use('/admin', require('./routes/admin')); // Admin dashboard

// Handle undefined routes
app.use((req, res) => {
  res.status(404).render('404');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`kira's Server is running on http://localhost:${PORT}`));
