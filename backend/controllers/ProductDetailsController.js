const woohooService = require('../services/woohooService'); 
const productDetailModel = require('../models/productdetail');

const getProductDetailsBySku = async (req, res) => {
  const { sku } = req.params;
  const url = `https://sandbox.woohoo.in/rest/v3/catalog/products/${sku}`;

  try {
    const data = await woohooService.fetchData(url, 'GET');

    // Build product detail object
    const detail = {
      sku: data.sku,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      minPrice: parseInt(data.price?.min) || 0,
      maxPrice: parseInt(data.price?.max) || 0,
      denominations: data.price?.denominations || [],
      currencySymbol: data.price?.currency?.symbol || '₹',
      thumbnail: data.images?.thumbnail || '',
      baseImage: data.images?.base || '',
      expiry: data.expiry || '',
      tnc: data.tnc?.content || '',
      brandName: data.brandName || '',
      url: data.url || ''
    };

    console.log('✅ Woohoo data fetched:', detail);

    // Ensure table exists before inserting
    await productDetailModel.createProductDetailsTable();

    // Insert or update product details
    await productDetailModel.insertOrUpdateProductDetail(detail);

    // Fetch the updated product details
    const stored = await productDetailModel.getProductDetailBySku(sku);

    res.json(stored);
  } catch (error) {
    console.error('❌ Error fetching product detail:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
};

module.exports = { getProductDetailsBySku };
