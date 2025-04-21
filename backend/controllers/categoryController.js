const woohooService = require('../services/woohooService');
const categoryModel = require('../models/categoryModel');

const getCategories = async (req, res) => {
  try {
    // Step 1: Create table if not exists
    await categoryModel.createCategoryTable();

    // Step 2: Fetch categories from Woohoo API
    const url = 'https://sandbox.woohoo.in/rest/v3/catalog/categories';
    const apiData = await woohooService.fetchData(url, 'GET');
    
    
    // Step 3: Insert data into DB
    if (Array.isArray(apiData)) {
      // Case: response is an array of categories
      for (const category of apiData) {
      
        await categoryModel.insertCategory(category);
      }
    } else if (apiData && typeof apiData === 'object') {
      // Case: single category object
      
      await categoryModel.insertCategory(apiData);
    } else {
      console.log('Unexpected API response format');
    }

    // Step 4: Fetch all from DB to send to frontend
    const categories = await categoryModel.getAllCategories();
    res.json(categories);

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch and store categories' });
  }
};

module.exports = { getCategories };
