// File: backend/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to place Woohoo order
router.post('/place-order', orderController.placeOrder);

module.exports = router;
