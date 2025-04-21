const db = require('../config/db');

// Create table if not exists
const createCategoryTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      url TEXT,
      subcategoriesCount INT
    )
  `);
};

// Insert category if not exists
const insertCategory = async (category) => {
    // Log category data for debugging
  await db.query(
    `REPLACE INTO categories (id, name, url, subcategoriesCount) VALUES (?, ?, ?, ?)`,
    [category.id, category.name, category.url, category.subcategoriesCount || 0]
  );
};


// Fetch all categories from DB
const getAllCategories = async () => {
  const [rows] = await db.query(`SELECT * FROM categories`);
  return rows;
};

module.exports = {
  createCategoryTable,
  insertCategory,
  getAllCategories,
};
