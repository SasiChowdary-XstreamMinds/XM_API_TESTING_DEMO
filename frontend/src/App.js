import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';  // Import the ProductDetail component
import Categories from './components/Categories';

function App() {
  return (
    <Router>
      <Routes>

        {/* Default route to redirect to the product list */}
        <Route path="/" element={<Categories />} />
        
        {/* Route for the product list */}
        <Route path="/products" element={<ProductList />} />
        
        
        {/* Route for the product detail page based on SKU */}
        <Route path="/products/:sku" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
