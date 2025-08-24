import { useProducts } from "../../hooks/useProducts";

import CategoryFilters from "./CategoryFilters";
import ProductList from "./ProductList";

export default function ProductGrid() {
  
  const { products, loading, error } = useProducts({
    featured: true, // Show featured products on home page
    limit: 8 // Limit to 8 products for home page
  });

  if (loading) {
    return (
      <div className="products-section">
        <div className="products-header">
          <h2>Our Products</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-section">
        <div className="products-header">
          <h2>Our Products</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Error loading products: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="products-section">
      <div className="products-header">
        <h2>Our Products</h2>
        <CategoryFilters />
      </div>

      <ProductList products={products} />
    </div>
  );
}
