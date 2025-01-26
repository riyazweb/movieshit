import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter here"
          className="w-full bg-black  text-white text-xl px-6 py-5 pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
        <button 
          type="submit" 
          className="absolute right-3 bottom-2 bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-lg font-bold"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;