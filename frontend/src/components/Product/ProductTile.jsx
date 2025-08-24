import React from 'react';
import ProductCard from './ProductCard';

const ProductTile = ({ products, viewMode, onViewProduct, onAddToCart }) => {
  return (
    <div className={`products-container ${viewMode}`}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onViewProduct={onViewProduct}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductTile;
