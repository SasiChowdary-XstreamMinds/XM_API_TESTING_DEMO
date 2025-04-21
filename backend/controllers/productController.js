// const woohooService = require('../services/woohooService');
// const categoryProductModel = require('../models/productList');

// const getProductsByCategory = async (req, res) => {
//   const categoryId = req.query.categoryId || '121';
//   const url = `https://sandbox.woohoo.in/rest/v3/catalog/categories/${categoryId}/products`;

//   try {
//     const data = await woohooService.fetchData(url, 'GET');
//     const products = data?.products || [];

//     for (const product of products) {
//       const {
//         sku,
//         name,
//         url: productUrl,
//         minPrice,
//         maxPrice,
//         images = {}
//       } = product;

//       const thumbnail = images.thumbnail || '';

//       try {
//         await categoryProductModel.insertCategoryProduct({
//           categoryId,
//           sku,
//           name,
//           thumbnail,
//           url: productUrl,
//           minPrice,
//           maxPrice
//         });
//       } catch (err) {
//         console.error(`❌ Failed to insert SKU ${sku}:`, err.message);
//       }
//     }

//     const storedProducts = await categoryProductModel.getProductsByCategoryId(categoryId);
//     res.json({ categoryId, products: storedProducts });
//   } catch (error) {
//     console.error('❌ Error fetching from Woohoo API:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Something went wrong while fetching the products' });
//   }
// };

// module.exports = { getProductsByCategory };


const woohooService = require('../services/woohooService');
const categoryProductModel = require('../models/productList');
const productDetailModel = require('../models/productdetail'); // 👈 Add this

const getProductsByCategory = async (req, res) => {
  const categoryId = req.query.categoryId || '121';
  const url = `https://sandbox.woohoo.in/rest/v3/catalog/categories/${categoryId}/products`;

  try {
    const data = await woohooService.fetchData(url, 'GET');
    const products = data?.products || [];

    const insertedSkus = [];

    // Ensure tables exist
    await categoryProductModel.createCategoryProductTable(); // If applicable
    await productDetailModel.createProductDetailsTable();

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

      // Fetch and insert full detail
      try {
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
        insertedSkus.push(sku);
      } catch (err) {
        console.error(`❌ Failed to fetch/store details for SKU ${sku}:`, err.message);
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
