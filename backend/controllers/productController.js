const woohooService = require('../services/woohooService');
const categoryProductModel = require('../models/productList');
const productDetailModel = require('../models/productdetail'); // 👈 Add this

// ✅ Helper function to check and insert/fetch product detail
const getOrInsertProductDetail = async (sku) => {
  try {
    // 1. Check if detail exists in DB
    const existing = await productDetailModel.getProductDetailBySku(sku);
    if (existing) {
      return { source: 'db', detail: existing };
    }

    // 2. If not, fetch from Woohoo API
    const detailUrl = `https://sandbox.woohoo.in/rest/v3/catalog/products/${sku}`;
    const detailData = await woohooService.fetchData(detailUrl, 'GET');

    const detail = {
      sku: detailData.sku,
      name: detailData.name,
      shortDescription: detailData.shortDescription,
      description: detailData.description,
      minPrice: parseInt(detailData.price?.min) || 0,
      maxPrice: parseInt(detailData.price?.max) || 0,
      denominations: detailData.price?.denominations || [],
      currencySymbol: detailData.price?.currency?.symbol || '₹',
      thumbnail: detailData.images?.thumbnail || '',
      baseImage: detailData.images?.base || '',
      expiry: detailData.expiry || '',
      tnc: detailData.tnc?.content || '',
      brandName: detailData.brandName || '',
      url: detailData.url || ''
    };

    await productDetailModel.insertOrUpdateProductDetail(detail);
    return { source: 'api', detail };
  } catch (err) {
    console.error(`❌ Error in getOrInsertProductDetail for SKU ${sku}:`, err.message);
    return null;
  }
};

// ✅ Main controller function
const getProductsByCategory = async (req, res) => {
  const categoryId = req.query.categoryId || '121';
  const url = `https://sandbox.woohoo.in/rest/v3/catalog/categories/${categoryId}/products`;

  try {
    const data = await woohooService.fetchData(url, 'GET');
    const products = data?.products || [];

    const insertedSkus = [];

    // Ensure tables exist
    await categoryProductModel.createCategoryProductTable?.(); // Optional chaining in case not needed
    await productDetailModel.createProductDetailsTable?.();

    for (const product of products) {
      const {
        sku,
        name,
        url: productUrl,
        minPrice,
        maxPrice,
        images = {}
      } = product;

      const thumbnail = images.thumbnail || '';

      // Insert basic category product
      try {
        await categoryProductModel.insertCategoryProduct({
          categoryId,
          sku,
          name,
          thumbnail,
          url: productUrl,
          minPrice,
          maxPrice
        });
      } catch (err) {
        console.error(`❌ Failed to insert category SKU ${sku}:`, err.message);
      }

      // ✅ Check DB or fetch and insert detail
      const result = await getOrInsertProductDetail(sku);
      if (result && result.detail) {
        insertedSkus.push(sku);
      }
    }

    const storedProducts = await categoryProductModel.getProductsByCategoryId(categoryId);
    res.json({ categoryId, total: storedProducts.length, insertedSkus, products: storedProducts });
  } catch (error) {
    console.error('❌ Error fetching from Woohoo API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong while fetching the products' });
  }
};

module.exports = { getProductsByCategory };