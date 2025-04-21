const db = require('../config/db');

// Create table if not exists
const createProductDetailsTable = async () => {
  try {
    console.log('🛠️ Attempting to create product_details table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS product_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sku VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        shortDescription TEXT,
        description TEXT,
        minPrice INT,
        maxPrice INT,
        denominations TEXT,
        currencySymbol VARCHAR(10),
        thumbnail TEXT,
        baseImage TEXT,
        expiry VARCHAR(255),
        tnc TEXT,
        brandName VARCHAR(255),
        url TEXT
      )
    `);
    console.log('✅ product_details table created or already exists');
  } catch (err) {
    console.error('❌ Failed to create product_details table:', err.message);
  }
}

const insertOrUpdateProductDetail = async (product) => {
  try {
    const {
      sku, name, shortDescription, description,
      minPrice, maxPrice, denominations,
      currencySymbol, thumbnail, baseImage,
      expiry, tnc, brandName, url
    } = product;

    await db.query(`
      INSERT INTO product_details (
        sku, name, shortDescription, description,
        minPrice, maxPrice, denominations,
        currencySymbol, thumbnail, baseImage,
        expiry, tnc, brandName, url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        shortDescription = VALUES(shortDescription),
        description = VALUES(description),
        minPrice = VALUES(minPrice),
        maxPrice = VALUES(maxPrice),
        denominations = VALUES(denominations),
        currencySymbol = VALUES(currencySymbol),
        thumbnail = VALUES(thumbnail),
        baseImage = VALUES(baseImage),
        expiry = VALUES(expiry),
        tnc = VALUES(tnc),
        brandName = VALUES(brandName),
        url = VALUES(url)
    `, [
      sku, name, shortDescription, description,
      minPrice, maxPrice, JSON.stringify(denominations),
      currencySymbol, thumbnail, baseImage,
      expiry, tnc, brandName, url
    ]);

    console.log(`✅ Product inserted/updated: ${sku}`);
  } catch (err) {
    console.error('❌ Error inserting/updating product:', err.message);
  }
};

const getProductDetailBySku = async (sku) => {
  try {
    const [rows] = await db.query(`SELECT * FROM product_details WHERE sku = ?`, [sku]);
    return rows[0] || null;
  } catch (err) {
    console.error('❌ Error fetching product by SKU:', err.message);
    return null;
  }
};

module.exports = {
  createProductDetailsTable,
  insertOrUpdateProductDetail,
  getProductDetailBySku,
};
