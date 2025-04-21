import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const RelatedProducts = ({ sku }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${sku}/related`);
        setRelatedProducts(res.data.relatedProducts || []);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelated();
  }, [sku]);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="related-products-container">
      <h2 className="related-heading">You may also like</h2>
      <div className="related-products-grid">
        {relatedProducts.map((product) => (
          <div key={product.sku} className="related-product-card">
            <img src={product.images.thumbnail} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{product.minPrice} - ₹{product.maxPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
