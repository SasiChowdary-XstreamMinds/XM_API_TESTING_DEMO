import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RelatedProducts from './RelatedProducts';
import './App.css';

function ProductDetail() {
  const { sku } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDenomination, setSelectedDenomination] = useState('');
  const navigate = useNavigate();

  const handleDenominationChange = (e) => {
    setSelectedDenomination(e.target.value);
  };

  const handleBuyNow = async () => {
    if (!selectedDenomination) {
      alert('Please select a denomination first.');
      return;
    }

    // Remove currency symbols/spaces and parse as number
    const parsedPrice = parseFloat(selectedDenomination.replace(/[^\d.]/g, ''));

    console.log('Selected denomination:', selectedDenomination);
    console.log('Parsed price:', parsedPrice);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Please select a valid denomination.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/orders/place-order', {
        sku,
        price: parsedPrice,
      });

      navigate('/order-success', { state: response.data });
    } catch (err) {
      alert('Order failed: ' + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/product-details/products/${sku}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [sku]);

  const handleImageError = (e) => {
    e.target.src = 'default-thumbnail.jpg';
  };

  if (loading) return <p className="loading">Loading details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>No details found for SKU: {sku}</p>;

  const denominationOptions = Array.isArray(product.denominations)
    ? product.denominations.map(d => d.toString().trim())
    : typeof product.denominations === 'string'
      ? product.denominations.replace(/[\[\]₹]/g, '').split(',').map(d => d.trim())
      : [];

  return (
    <div className="product-detail">
      <Link to="/products" className="back-btn">← Back to Products</Link>
      <h1>{product.name}</h1>
      <img 
        src={product.thumbnail || null} 
        alt={product.name} 
        className="product-thumbnail"
        onError={handleImageError}
      />
      <p><strong>Description:</strong> {product.description || 'N/A'}</p>
      <p><strong>Short Description:</strong> {product.shortDescription || 'N/A'}</p>
      <p><strong>Offer:</strong> {product.offerShortDesc || 'N/A'}</p>
      <p><strong>Price:</strong> ₹{product.minPrice} - ₹{product.maxPrice}</p>
      <p><strong>Currency:</strong> {product.currencySymbol} ({product.currencyCode})</p>

      <p><strong>Select Denomination:</strong>
        <select 
          value={selectedDenomination} 
          onChange={handleDenominationChange}
          className="denomination-dropdown"
        >
          <option value="">Select Denomination</option>
          {denominationOptions.map((denom, index) => (
            <option key={index} value={denom}>
              ₹{denom}
            </option>
          ))}
        </select>
      </p>

      <button 
        className="buy-now-btn" 
        onClick={handleBuyNow} 
        disabled={!selectedDenomination}
      >
        Buy Now
      </button>

      <p><strong>Expiry:</strong> {product.expiry || 'N/A'}</p>

      {product.relatedProductOptions && Object.entries(product.relatedProductOptions).length > 0 ? (
        <ul>
          {Object.entries(product.relatedProductOptions).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {value ? 'Available' : 'Not Available'}</li>
          ))}
        </ul>
      ) : (
        <p>No related product options available.</p>
      )}

      <p><strong>Terms & Conditions:</strong> <a href={product.tnc?.link || '#'} target="_blank" rel="noopener noreferrer">View T&C</a></p>

      {product.themes && product.themes.length > 0 && (
        <>
          <h3>Themes</h3>
          <div className="themes-grid">
            {product.themes.map((theme) => (
              <div key={theme.sku}>
                <img src={theme.image} alt={theme.title} />
                <h4>{theme.title}</h4>
              </div>
            ))}
          </div>
        </>
      )}

      <h3>Additional Info</h3>
      <p><strong>Brand Name:</strong> {product.brandName || 'N/A'}</p>
      <p><strong>Brand Code:</strong> {product.brandCode || 'N/A'}</p>
      <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
      <p><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>

      <RelatedProducts sku={sku} />
    </div>
  );
}

export default ProductDetail;
