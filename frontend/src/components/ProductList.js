import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products');
        setProducts(response.data.products || []);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'default-thumbnail.jpg'; // fallback image
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <div className="product-list-container">
        {products.map((product) => (
          <div key={product.sku} className="product-card">
            <Link to={`/products/${product.sku}`}>
              <img 
                src={product.thumbnail || 'default-thumbnail.jpg'} 
                alt={product.name} 
                className="product-thumbnail"
                onError={handleImageError} // fallback on error
              />
              <h2>{product.name}</h2>
              <p>Price: ₹{product.minPrice} - ₹{product.maxPrice}</p>
              <p>Offer: {product.offerShortDesc}</p>
            </Link>
            <button onClick={() => navigate(`/products/${product.sku}`)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
