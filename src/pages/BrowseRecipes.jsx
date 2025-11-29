import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';
import SurpriseMe from '../components/SurpriseMe';
import Ingredients3 from '../assets/Ingredients3.jpg';

const BrowseRecipes = () => {
  const { searchRecipes, recipes } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    maxPrepTime: null,
  });

  // Get unique categories from recipes
  const categories = ['all', ...new Set(recipes.map(r => r.category))];

  // Compute filtered recipes using useMemo instead of useEffect + setState
  const filteredRecipes = useMemo(() => {
    return searchRecipes(searchQuery, filters);
  }, [searchQuery, filters, searchRecipes]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: 'all',
      difficulty: 'all',
      maxPrepTime: null,
    });
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    filters.category !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.maxPrepTime !== null;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-2 md:mb-4">Browse Recipes</h1>
        <p className="text-sm md:text-base text-slate-700">
          Discover and explore delicious recipes from our collection
        </p>
      </div>

      {/* Surprise Me Feature */}
      <div className="mb-6">
        <SurpriseMe />
      </div>

      {/* Decorative Image Banner */}
      <div className="mb-6 overflow-hidden rounded-2xl shadow-xl relative h-48 md:h-64">
        <img
          src={Ingredients3}
          alt="Fresh cooking ingredients"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center">
          <div className="px-8 md:px-12 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Fresh Ingredients, Amazing Recipes</h2>
            <p className="text-white/90 text-sm md:text-base">Explore our collection of recipes and find your next culinary masterpiece</p>
          </div>
        </div>
      </div>

      {/* Compact Search & Filter Box */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search recipes by name, ingredients..."
              className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Prep Time Filter */}
          <select
            value={filters.maxPrepTime || ''}
            onChange={(e) => handleFilterChange('maxPrepTime', e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Any Time</option>
            <option value="30">Under 30 min</option>
            <option value="60">Under 60 min</option>
            <option value="120">Under 120 min</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm md:text-base text-slate-700">
          Found <span className="font-semibold text-blue-600">{filteredRecipes.length}</span> recipe
          {filteredRecipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 md:py-12">
          <div className="text-5xl md:text-6xl mb-3 md:mb-4">🔍</div>
          <h3 className="text-xl md:text-2xl font-semibold text-purple-700 mb-2">No recipes found</h3>
          <p className="text-sm md:text-base text-slate-600 mb-6 px-4">
            Try adjusting your search or filters to find what you're looking for
          </p>
        </div>
      )}
    </div>
  );
};

export default BrowseRecipes;
