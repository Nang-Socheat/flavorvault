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
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-xl border border-purple-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
          <span className="text-3xl animate-bounce">🎲</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Feeling Adventurous?
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Can't decide what to cook? Let us surprise you with a random recipe!
        </p>
      </div>

      {/* Surprise Me Button */}
      <div className="text-center mb-6">
        <button
          onClick={getRandomRecipe}
          disabled={isAnimating}
          className={`
            inline-flex items-center gap-3
            bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500
            text-white px-8 py-4 rounded-xl font-bold text-lg
            shadow-lg hover:shadow-2xl
            transform transition-all duration-300
            ${isAnimating ? 'scale-95 opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          `}
        >
          {isAnimating ? (
            <>
              <span className="animate-spin text-2xl">🎲</span>
              Picking a Recipe...
            </>
          ) : (
            <>
              <span className="text-2xl">✨</span>
              Surprise Me!
              <span className="text-2xl">✨</span>
            </>
          )}
        </button>
      </div>

      {/* Random Recipe Display */}
      {randomRecipe && !isAnimating && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-[fadeInUp_0.5s_ease-out] border-2 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Recipe Image - Fixed horizontal aspect ratio */}
            <div className="relative h-80 overflow-hidden group">
              <img
                src={randomRecipe.image}
                alt={randomRecipe.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-lg flex items-center gap-1">
                  <span>{categoryEmojis[randomRecipe.category] || '🍽️'}</span>
                  {randomRecipe.category}
                </span>
                <span className={`
                  px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg
                  ${randomRecipe.difficulty === 'Easy' ? 'bg-green-500' :
                    randomRecipe.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}
                `}>
                  {randomRecipe.difficulty}
                </span>
              </div>

              {/* Time Badge */}
              <div className="absolute bottom-4 left-4">
                <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <span>⏱️</span>
                  {randomRecipe.prepTime + randomRecipe.cookTime} min total
                </span>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="p-6 flex flex-col justify-between bg-gradient-to-br from-white to-purple-50">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {randomRecipe.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                  {randomRecipe.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="text-xs text-gray-600 font-medium">Servings</div>
                    <div className="text-lg font-bold text-gray-800">{randomRecipe.servings}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🔪</div>
                    <div className="text-xs text-gray-600 font-medium">Prep</div>
                    <div className="text-lg font-bold text-gray-800">{randomRecipe.prepTime}m</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🍳</div>
                    <div className="text-xs text-gray-600 font-medium">Cook</div>
                    <div className="text-lg font-bold text-gray-800">{randomRecipe.cookTime}m</div>
                  </div>
                </div>

                {/* Tags */}
                {randomRecipe.tags && randomRecipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {randomRecipe.tags.slice(0, 4).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/recipe/${randomRecipe.id}`}
                  className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-md text-center"
                >
                  View Recipe
                  <span className="ml-2">→</span>
                </Link>
                <button
                  onClick={getRandomRecipe}
                  className="flex-1 inline-flex items-center justify-center border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 text-center"
                >
                  <span className="mr-2">🎲</span>
                  Try Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!randomRecipe && !isAnimating && (
        <div className="text-center py-8 bg-white/50 rounded-xl border-2 border-dashed border-purple-300">
          <div className="text-6xl mb-3 opacity-50">🎲</div>
          <p className="text-gray-500 font-medium">Click "Surprise Me!" to discover a random recipe</p>
        </div>
      )}
    </div>
  );
};

export default SurpriseMe;
