const db = require('../config/db');

// Create the table if it doesn't exist
const createCategoryProductTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS category_products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      categoryId VARCHAR(50),
      sku VARCHAR(255),
      name VARCHAR(255),
      thumbnail TEXT,
      url TEXT,
      minPrice INT,
      maxPrice INT
    )
  `);
};

// Insert a single product into the table
const insertCategoryProduct = async (product) => {
  await createCategoryProductTable(); // Ensure table exists before inserting

  const {
    categoryId,
    sku,
    name,
    thumbnail = '',
    url = '',
    minPrice = 0,
    maxPrice = 0
  } = product;

  await db.query(
    `INSERT INTO category_products (
      categoryId, sku, name, thumbnail, url, minPrice, maxPrice
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [categoryId, sku, name, thumbnail, url, parseInt(minPrice), parseInt(maxPrice)]
  );
};

// Delete all products under a specific category
const deleteProductsByCategoryId = async (categoryId) => {
  await db.query('DELETE FROM category_products WHERE categoryId = ?', [categoryId]);
};

// Get all products under a specific category
const getProductsByCategoryId = async (categoryId) => {
  const [rows] = await db.query(
    'SELECT * FROM category_products WHERE categoryId = ?',
    [categoryId]
  );
  return rows;
};

// Export all model functions
module.exports = {
  createCategoryProductTable,
  insertCategoryProduct,
  deleteProductsByCategoryId,
  getProductsByCategoryId
};
