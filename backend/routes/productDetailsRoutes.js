const express = require('express');
const router = express.Router();
const productDetailController = require('../controllers/ProductDetailsController');

// GET product detail by SKU
router.get('/products/:sku', productDetailController.getProductDetailsBySku);

module.exports = router;
