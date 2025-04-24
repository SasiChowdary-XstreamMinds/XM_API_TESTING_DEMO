require('dotenv').config();
const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const productDetailsRoutes = require('./routes/productDetailsRoutes');
const relatedProductRoutes = require('./routes/relatedProductRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // or '*', but be cautious for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

// Use routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', relatedProductRoutes);
app.use('/api/product-details', productRoutes);
app.use('/api/product-details', productDetailsRoutes);
app.use('/api/orders', orderRoutes);



// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
