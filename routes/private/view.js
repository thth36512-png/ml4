// ============================================
// ROUTES - routes/private/view.js
// ============================================
const express = require('express');
const router = express.Router();
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Middleware to check authentication
async function checkAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/');
    }

    const response = await axios.get(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: { Cookie: `token=${token}` }
    });

    req.user = response.data;
    next();
  } catch (error) {
    res.redirect('/');
  }
}

// Middleware to check role
function requireRole(role) {
  return async (req, res, next) => {
    if (req.user.role !== role) {
      return res.redirect('/');
    }
    next();
  };
}

// Customer routes
router.get('/dashboard', checkAuth, requireRole('customer'), (req, res) => {
  res.render('customerHomepage', { user: req.user });
});

router.get('/trucks', checkAuth, requireRole('customer'), (req, res) => {
  res.render('trucks', { user: req.user });
});

router.get('/truckMenu/:truckId', checkAuth, requireRole('customer'), (req, res) => {
  res.render('truckMenu', { user: req.user, truckId: req.params.truckId });
});

router.get('/cart', checkAuth, requireRole('customer'), (req, res) => {
  res.render('cart', { user: req.user });
});

router.get('/myOrders', checkAuth, requireRole('customer'), (req, res) => {
  res.render('myOrders', { user: req.user });
});

// Truck Owner routes
router.get('/ownerDashboard', checkAuth, requireRole('truckOwner'), (req, res) => {
  res.render('ownerDashboard', { user: req.user });
});

router.get('/menuItems', checkAuth, requireRole('truckOwner'), (req, res) => {
  res.render('menuItems', { user: req.user });
});

router.get('/addMenuItem', checkAuth, requireRole('truckOwner'), (req, res) => {
  res.render('addMenuItem', { user: req.user });
});

router.get('/truckOrders', checkAuth, requireRole('truckOwner'), (req, res) => {
  res.render('truckOrders', { user: req.user });
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
