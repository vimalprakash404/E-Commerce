import ProductCard from "./ProductCard.jsx";

export default function ProductList({ products }) {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
