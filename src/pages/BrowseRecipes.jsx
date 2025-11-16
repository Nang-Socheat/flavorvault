import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';

const BrowseRecipes = () => {
  const { searchRecipes } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    maxPrepTime: null,
  });
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // useEffect to update filtered recipes whenever search or filters change
  useEffect(() => {
    const results = searchRecipes(searchQuery, filters);
    setFilteredRecipes(results);
  }, [searchQuery, filters, searchRecipes]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Browse Recipes</h1>
        <p className="text-gray-600">
          Discover and explore delicious recipes from our collection
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by recipe name, ingredients, category..."
        />
      </div>

      {/* Filter Panel */}
      <FilterPanel onFilterChange={handleFilterChange} />

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Found <span className="font-semibold">{filteredRecipes.length}</span> recipe
          {filteredRecipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No recipes found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filters to find what you're looking for
          </p>
        </div>
      )}
    </div>
  );
};

export default BrowseRecipes;
