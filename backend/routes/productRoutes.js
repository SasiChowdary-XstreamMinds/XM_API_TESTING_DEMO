const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');  // Import the controller

// Make sure the handler is a function like productController.getAllProducts
router.get('/', productController.getProductsByCategory);

module.exports = router;
