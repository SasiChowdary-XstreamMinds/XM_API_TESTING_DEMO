const express = require('express');
const router = express.Router();
const relatedProductController = require('../controllers/relatedProductController');

// Updated to receive SKU in the route path
router.get('/:sku/related', relatedProductController.getRelatedProducts);

module.exports = router;
