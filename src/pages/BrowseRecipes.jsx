import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';
import SurpriseMe from '../components/SurpriseMe';
import Ingredients3 from '../assets/Ingredients3.jpg';

const BrowseRecipes = () => {
  const { searchRecipes, recipes } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    maxPrepTime: null,
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Read category from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        category: categoryParam,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-6 md:py-8">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-50 animate-[fadeInUp_0.3s_ease-out]"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

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
