import { useState } from 'react';

const FilterPanel = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    maxPrepTime: null,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const categories = ['All', 'Italian', 'Indian', 'Mexican', 'Dessert', 'Breakfast', 'Salad'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const prepTimes = [
    { label: 'Any time', value: null },
    { label: 'Under 30 min', value: 30 },
    { label: 'Under 60 min', value: 60 },
    { label: 'Under 120 min', value: 120 },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: 'all',
      difficulty: 'all',
      maxPrepTime: null,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.maxPrepTime !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">🔧</span>
          Filters
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden text-gray-600"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange('category', category.toLowerCase())}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.category === category.toLowerCase()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleFilterChange('difficulty', difficulty.toLowerCase())}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.difficulty === difficulty.toLowerCase()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Prep Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prep Time
          </label>
          <div className="flex flex-wrap gap-2">
            {prepTimes.map((time) => (
              <button
                key={time.label}
                onClick={() => handleFilterChange('maxPrepTime', time.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.maxPrepTime === time.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
