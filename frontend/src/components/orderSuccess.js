import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function OrderSuccess() {
  const { state } = useLocation();
  
  // Debug log to see what data we're receiving
  console.log('Order Success State:', state);

  if (!state) {
    console.log('No state data found');
    return <p>No order data found.</p>;
  }

  // Destructure with default values to prevent undefined errors
  const {
    orderId = 'N/A',
    refno = 'N/A',
    cards = [],
    products = {},
    currency = { symbol: '₹', code: 'INR' },
    status = 'Success'
  } = state;

  // Debug logs for individual data
  console.log('Cards:', cards);
  console.log('Products:', products);
  console.log('Currency:', currency);

  return (
    <div className="order-success p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>

      <div className="mb-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Reference No:</strong> {refno}</p>
        <p><strong>Status:</strong> <span className="text-green-600">{status}</span></p>
        <p><strong>Currency:</strong> {currency.symbol} ({currency.code})</p>
      </div>

      {cards && cards.length > 0 ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Card Details:</h2>
          {cards.map((card, index) => (
            <div key={index} className="card-info p-4 border rounded-md mb-4 bg-gray-50">
              <p><strong>Card Number:</strong> {card.cardNumber || 'N/A'}</p>
              <p><strong>PIN:</strong> {card.cardPin || 'N/A'}</p>
              <p><strong>Amount:</strong> {currency.symbol}{card.amount || '0'}</p>
              <p><strong>Validity:</strong> {card.validity ? new Date(card.validity).toLocaleString() : 'N/A'}</p>
              <p><strong>Product:</strong> {card.productName || 'N/A'}</p>
              <p><strong>SKU:</strong> {card.sku || 'N/A'}</p>
              {card.redemptionUrl && (
                <p>
                  <strong>Redemption URL:</strong>{' '}
                  <a href={card.redemptionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Click here to redeem
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 p-4 border rounded-md bg-gray-50">
          <p>No card details available</p>
        </div>
      )}

      {products && Object.keys(products).length > 0 ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Product Information:</h2>
          {Object.entries(products).map(([key, product]) => (
            <div key={key} className="product-info p-4 border rounded-md mb-4 bg-gray-50">
              <p><strong>Product Name:</strong> {product.name || 'N/A'}</p>
              <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
              <p><strong>Card Behaviour:</strong> {product.cardBehaviour || 'N/A'}</p>
              {product.specialInstruction && (
                <p><strong>Special Instructions:</strong> {product.specialInstruction}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 p-4 border rounded-md bg-gray-50">
          <p>No product information available</p>
        </div>
      )}

      <div className="mt-6">
        <Link 
          to="/products" 
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess; 