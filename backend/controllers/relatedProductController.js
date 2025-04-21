const woohooService = require('../services/woohooService');

const getRelatedProducts = async (req, res) => {
  const { sku } = req.params;
  const url = `https://sandbox.woohoo.in/rest/v3/catalog/products/${sku}/related`;
  try {
    const data = await woohooService.fetchData(url, 'GET');
    res.json(data);
  } catch (err) {
    console.error('Error fetching related products:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch related products' });
  }
};

module.exports = { getRelatedProducts };
