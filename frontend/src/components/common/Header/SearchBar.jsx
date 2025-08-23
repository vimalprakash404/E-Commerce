import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query, view: "products" }); // go to products with query
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setSearchParams({ q: e.target.value, view: "products" })}
        className="search-input"
      />
      <button type="submit" className="search-btn">
        <Search size={20} />
      </button>
    </form>
  );
}
