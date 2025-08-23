import { products } from "../../data/products";
import { useApp } from "../../context/AppContext.jsx";
import CategoryFilters from "./CategoryFilters";
import ProductList from "./ProductList";

export default function ProductGrid() {
  const { searchQuery, selectedCategory } = useApp();

  const filteredProducts = products.filter((product) => {
  const name = product?.name?.toLowerCase() || "";
  const description = product?.description?.toLowerCase() || "";
  const query = searchQuery?.toLowerCase() || "";

  const matchesSearch =
    name.includes(query) || description.includes(query);

  const matchesCategory =
    selectedCategory === "all" || product.category === selectedCategory;

  return matchesSearch && matchesCategory;
});
 

  return (
    <div className="products-section">
      <div className="products-header">
        <h2>Our Products</h2>
        <CategoryFilters />
      </div>

      <ProductList products={filteredProducts} />
    </div>
  );
}
