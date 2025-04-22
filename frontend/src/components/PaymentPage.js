import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './App.css';

function PaymentPage() {
  const location = useLocation();
  const { sku, name, denomination } = location.state || {};

  return (
    <div className="payment-page">
      <h1>Payment Page</h1>
      {sku && name && denomination ? (
        <>
          <p><strong>SKU:</strong> {sku}</p>
          <p><strong>Product Name:</strong> {name}</p>
          <p><strong>Selected Denomination:</strong> ₹{denomination}</p>
          <button className="proceed-payment-btn">Proceed to Pay</button>
        </>
      ) : (
        <p>Missing payment information.</p>
      )}
      <br />
      <Link to="/products" className="back-btn">← Back to Products</Link>
    </div>
  );
}

export default PaymentPage;
