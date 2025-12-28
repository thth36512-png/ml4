const express = require('express');
const router = express.Router();
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Register
router.post('/user', async (req, res) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Request failed' });
  }
});

// Login
router.post('/user/login', async (req, res) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, req.body);
    
    if (response.data.token) {
      res.cookie('token', response.data.token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });
    }
    
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Login failed' });
  }
});

module.exports = router;