import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState(null);  // Set the initial state to null
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/categories');
        const data = await response.json();
        console.log('Fetched from DB:', data);
  
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      }
    };
  
    loadCategories();
  }, []);
  

  if (error) return <div className="error">{error}</div>;
  if (!categories) return <div className="loading">Loading...</div>;

  return (
    <div className="categories-container">
      <h1 className="category-heading">Category List</h1>
      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => navigate(`/products?categoryId=${category.id}`)}
          >
            <h2>{category.name}</h2>
            <p><strong>ID:</strong> {category.id}</p>
            <p><strong>URL:</strong> {category.url}</p>
            <p><strong>Subcategories:</strong> {category.subcategoriesCount}</p>
            <button
              className="view-details-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products?categoryId=${category.id}`);
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
