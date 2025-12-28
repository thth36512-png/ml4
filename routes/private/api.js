// ============================================
// ROUTES - routes/private/api.js (COMPLETE VERSION)
// ============================================
const express = require('express');
const router = express.Router();
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Helper function
async function proxyRequest(req, res, method, path, data = null) {
  try {
    const config = {
      method,
      url: `${BACKEND_URL}${path}`,
      headers: {
        'Cookie': `token=${req.cookies.token}`,
        'Content-Type': 'application/json'
      }
    };

    if (data || req.body) {
      config.data = data || req.body;
    }

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Request failed' });
  }
}

// Trucks
router.get('/trucks/view', (req, res) => proxyRequest(req, res, 'GET', '/api/v1/trucks/view'));
router.get('/trucks/myTruck', (req, res) => proxyRequest(req, res, 'GET', '/api/v1/trucks/myTruck'));
router.put('/trucks/updateOrderStatus', (req, res) => proxyRequest(req, res, 'PUT', '/api/v1/trucks/updateOrderStatus'));

// Menu Items - Customer
router.get('/menuItem/truck/:truckId', (req, res) => {
  proxyRequest(req, res, 'GET', `/api/v1/menuItem/truck/${req.params.truckId}`);
});

router.get('/menuItem/truck/:truckId/category/:category', (req, res) => {
  proxyRequest(req, res, 'GET', `/api/v1/menuItem/truck/${req.params.truckId}/category/${req.params.category}`);
});

// Menu Items - Truck Owner
router.post('/menuItem/new', (req, res) => proxyRequest(req, res, 'POST', '/api/v1/menuItem/new'));
router.get('/menuItem/view', (req, res) => proxyRequest(req, res, 'GET', '/api/v1/menuItem/view'));
router.get('/menuItem/view/:itemId', (req, res) => {
  proxyRequest(req, res, 'GET', `/api/v1/menuItem/view/${req.params.itemId}`);
});
router.put('/menuItem/edit/:itemId', (req, res) => {
  proxyRequest(req, res, 'PUT', `/api/v1/menuItem/edit/${req.params.itemId}`);
});
router.delete('/menuItem/delete/:itemId', (req, res) => {
  proxyRequest(req, res, 'DELETE', `/api/v1/menuItem/delete/${req.params.itemId}`);
});

// Cart
router.post('/cart/new', (req, res) => proxyRequest(req, res, 'POST', '/api/v1/cart/new'));
router.get('/cart/view', (req, res) => proxyRequest(req, res, 'GET', '/api/v1/cart/view'));
router.put('/cart/edit/:cartId', (req, res) => {
  proxyRequest(req, res, 'PUT', `/api/v1/cart/edit/${req.params.cartId}`);
});
router.delete('/cart/delete/:cartId', (req, res) => {
  proxyRequest(req, res, 'DELETE', `/api/v1/cart/delete/${req.params.cartId}`);
});

// Orders - Customer
router.post('/order/new', (req, res) => proxyRequest(req, res, 'POST', '/api/v1/order/new'));
router.get('/order/myOrders', (req, res) => proxyRequest(req, res, 'GET', '/api/v1/order/myOrders'));
router.get('/order/details/:orderId', (req, res) => {
  proxyRequest(req, res, 'GET', `/api/v1/order/details/${req.params.orderId}`);
});

// Orders - Truck Owner
router.get('/order/truckOrders', (req, res) => proxyRequest(req, res, 'GET', '/api/v1/order/truckOrders'));
router.get('/order/truckOwner/:orderId', (req, res) => {
  proxyRequest(req, res, 'GET', `/api/v1/order/truckOwner/${req.params.orderId}`);
});
router.put('/order/updateStatus/:orderId', (req, res) => {
  proxyRequest(req, res, 'PUT', `/api/v1/order/updateStatus/${req.params.orderId}`);
});

module.exports = router;