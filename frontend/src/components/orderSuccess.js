import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function OrderSuccess() {
  const { state } = useLocation();

  if (!state) return <p>No order data found.</p>;

  const { orderId, refno, cards = [], products = [] } = state.data || {};


  return (
    <div className="order-success p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
     
      <div className="mb-4">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Reference No:</strong> {refno}</p>
      </div>

      {cards && cards.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Card Details:</h2>
          {cards.map((card, index) => (
            <div key={index} className="card-info p-4 border rounded-md mb-2">
              <p><strong>Card Number:</strong> {card.cardNumber}</p>
              <p><strong>Amount:</strong> ₹{card.amount}</p>
              <p><strong>Validity:</strong> {new Date(card.validity).toLocaleString()}</p>
              <p><strong>Product:</strong> {card.productName}</p>
              <p><strong>SKU:</strong> {card.sku}</p>
            </div>
          ))}
        </div>
      )}

      {/* Check if 'products' is defined and not empty */}
      {products && products.length > 0 ? (
  products.map((product, idx) => (
    <div key={idx} className="product-info p-4 border rounded-md mb-2">
      <p><strong>Product Name:</strong> {product.name}</p>
      <p><strong>SKU:</strong> {product.sku}</p>
      <p><strong>Card Behaviour:</strong> {product.cardBehaviour}</p>
    </div>
  ))
) : (
  <p>No products available.</p>
)}

      <Link to="/products" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        ← Back to Products
      </Link>
    </div>
  );
}

export default OrderSuccess;
