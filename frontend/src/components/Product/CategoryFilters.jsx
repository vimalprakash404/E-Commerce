import { categories } from "../../data/products";
import { useApp } from "../../context/AppContext.jsx";

export default function CategoryFilters() {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <div className="category-filters">
      <button
        className={selectedCategory === "all" ? "active" : ""}
        onClick={() => setSelectedCategory("all")}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={selectedCategory === category.slug ? "active" : ""}
          onClick={() => setSelectedCategory(category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
