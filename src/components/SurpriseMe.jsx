import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SurpriseMe = () => {
  const { recipes } = useApp();
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load persisted random recipe from localStorage on mount
  useEffect(() => {
    const savedRecipeId = localStorage.getItem('surpriseMe_recipeId');
    if (savedRecipeId && recipes.length > 0) {
      const recipe = recipes.find(r => r.id === savedRecipeId);
      if (recipe) {
        setRandomRecipe(recipe);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const getRandomRecipe = () => {
    if (recipes.length === 0) return;

    // Trigger animation
    setIsAnimating(true);

    // Short delay for animation effect
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      const recipe = recipes[randomIndex];
      setRandomRecipe(recipe);
      // Persist the random recipe ID to localStorage
      localStorage.setItem('surpriseMe_recipeId', recipe.id);
      setIsAnimating(false);
    }, 500);
  };

  const categoryEmojis = {
    Italian: '🍝',
    Mexican: '🌮',
    Indian: '🍛',
    Dessert: '🍰',
    Breakfast: '🥞',
    Salad: '🥗',
    Asian: '🥡',
    Seafood: '🦐',
    Lunch: '🥪',
    Dinner: '🍽️',
    Snack: '🍿',
    Appetizer: '🥟',
    Occasion: '🎉',
    'Khmer Food': '🍜',
  };

  return (
    <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 rounded-xl p-4 md:p-6 shadow-xl border-2 border-purple-300">
      {/* Compact Header with Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-700 to-pink-700 rounded-full shadow-lg">
            <span className="text-xl">🎲</span>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-purple-900">
              Feeling Adventurous?
            </h2>
            <p className="text-xs md:text-sm text-gray-800 font-semibold">Let us surprise you!</p>
          </div>
        </div>

        <button
          onClick={getRandomRecipe}
          disabled={isAnimating}
          className={`
            inline-flex items-center gap-2 whitespace-nowrap
            bg-gradient-to-r from-purple-600 to-pink-600
            text-white px-5 py-2.5 rounded-lg font-semibold text-sm
            shadow-md hover:shadow-lg
            transform transition-all duration-300
            ${isAnimating ? 'scale-95 opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          `}
        >
          {isAnimating ? (
            <>
              <span className="animate-spin text-lg">🎲</span>
              Picking...
            </>
          ) : (
            <>
              <span className="text-lg">✨</span>
              Surprise Me!
            </>
          )}
        </button>
      </div>

      {/* Loading Animation - Large Dice */}
      {isAnimating && (
        <div className="bg-white/80 rounded-lg shadow-md border border-purple-200 h-[180px] sm:h-[200px] lg:h-[160px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl animate-spin mb-4">🎲</div>
            <p className="text-lg font-bold text-purple-700 animate-pulse">Finding your surprise...</p>
          </div>
        </div>
      )}

      {/* Horizontal Recipe Card - Fixed Height */}
      {randomRecipe && !isAnimating && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-[fadeInUp_0.5s_ease-out] border border-purple-200 h-[180px] sm:h-[200px] lg:h-[160px]">
          <div className="flex h-full">
            {/* Recipe Image - Fixed Width */}
            <div className="relative w-[140px] sm:w-[180px] lg:w-[200px] flex-shrink-0 overflow-hidden group">
              <img
                src={randomRecipe.image}
                alt={randomRecipe.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Compact Badges */}
              <div className="absolute top-2 left-2">
                <span className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-md flex items-center gap-1">
                  <span>{categoryEmojis[randomRecipe.category] || '🍽️'}</span>
                  <span className="hidden sm:inline">{randomRecipe.category}</span>
                </span>
              </div>

              <div className="absolute bottom-2 left-2">
                <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                  ⏱️ {randomRecipe.prepTime + randomRecipe.cookTime}m
                </span>
              </div>
            </div>

            {/* Recipe Details - Flexible Width */}
            <div className="flex-1 p-3 lg:p-4 flex flex-col justify-between min-w-0">
              <div className="flex-1 min-h-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-1.5 truncate">
                  {randomRecipe.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 lg:mb-2 line-clamp-2">
                  {randomRecipe.description}
                </p>

                {/* Compact Stats */}
                <div className="flex flex-wrap gap-2 lg:gap-3 mb-2 lg:mb-2">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700">
                    <span>👥</span>
                    <span className="font-medium">{randomRecipe.servings}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700">
                    <span>🔪</span>
                    <span className="font-medium">{randomRecipe.prepTime}m</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700">
                    <span>🍳</span>
                    <span className="font-medium">{randomRecipe.cookTime}m</span>
                  </div>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-semibold text-white
                    ${randomRecipe.difficulty === 'Easy' ? 'bg-green-500' :
                      randomRecipe.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}
                  `}>
                    {randomRecipe.difficulty}
                  </span>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <Link
                  to={`/recipe/${randomRecipe.id}`}
                  className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-sm"
                >
                  <span className="hidden sm:inline">View Full Details</span>
                  <span className="sm:hidden">View</span>
                  <span className="ml-1">→</span>
                </Link>
                <button
                  onClick={getRandomRecipe}
                  className="inline-flex items-center justify-center border-2 border-purple-600 text-purple-600 px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm hover:bg-purple-50 transform hover:scale-105 transition-all duration-300"
                >
                  <span className="mr-1">🎲</span>
                  <span className="hidden sm:inline">Try Another</span>
                  <span className="sm:hidden">Another</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State - Minimal */}
      {!randomRecipe && !isAnimating && (
        <div className="text-center py-6 bg-white/80 rounded-lg border-2 border-dashed border-purple-500">
          <div className="text-4xl mb-2 opacity-80">🎲</div>
          <p className="text-gray-800 text-sm font-bold">Click the button above to discover a recipe</p>
        </div>
      )}
    </div>
  );
};

export default SurpriseMe;
