import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const RecipeCard = ({ recipe, compact = false, sourcePage = 'recipes' }) => {
  const { isFavorite, toggleFavorite } = useApp();
  const isRecipeFavorite = isFavorite(recipe.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  const handleRecipeClick = () => {
    // Save current recipe ID and source page for scroll-to-recipe on return
    console.log('Saving recipe ID:', recipe.id, 'from page:', sourcePage);
    sessionStorage.setItem('lastViewedRecipeId', recipe.id);
    sessionStorage.setItem('recipeSourcePage', sourcePage);
  };

  // Compact version for small screens
  if (compact) {
    return (
      <Link to={`/recipe/${recipe.id}`} className="block group" onClick={handleRecipeClick}>
        <div className="relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg h-[180px] flex flex-col border border-gray-200">
          {/* Image Section */}
          <div className="relative h-24 overflow-hidden flex-shrink-0 bg-gray-100">
            <img
              src={recipe.image || 'https://via.placeholder.com/200x150?text=No+Image'}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                if (e.target.src !== 'https://via.placeholder.com/200x150?text=No+Image') {
                  e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                } else {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect width="200" height="150" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                }
              }}
            />
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-1.5 right-1.5 z-20 bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
              aria-label={isRecipeFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span className="text-base leading-none">
                {isRecipeFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-2 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
              {recipe.title}
            </h3>
            <div className="flex items-center justify-between text-[10px] text-gray-600">
              <span className={`px-1.5 py-0.5 rounded text-white font-semibold ${
                recipe.difficulty === 'Easy' ? 'bg-green-600' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-600' :
                'bg-red-600'
              }`}>
                {recipe.difficulty}
              </span>
              <span className="font-medium">
                ⏱️ {recipe.prepTime + recipe.cookTime}m
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Standard version
  return (
    <Link to={`/recipe/${recipe.id}`} className="block group" onClick={handleRecipeClick}>
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl h-[420px] sm:h-[440px] lg:h-[400px] flex flex-col border border-gray-200">
        {/* Content Container */}
        <div className="relative flex flex-col h-full">
          {/* Image Section - Fixed Height */}
          <div className="relative h-48 sm:h-52 lg:h-44 overflow-hidden flex-shrink-0 bg-gray-100">
            <img
              src={recipe.image || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                if (e.target.src !== 'https://via.placeholder.com/400x300?text=No+Image') {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                } else {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';
                }
              }}
            />
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              aria-label={isRecipeFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span className="text-2xl leading-none">
                {isRecipeFavorite ? '❤️' : '🤍'}
              </span>
            </button>
            {/* Difficulty Badge */}
            <div className="absolute bottom-3 left-3 z-20">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg ${
                recipe.difficulty === 'Easy' ? 'bg-green-600' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-600' :
                'bg-red-600'
              }`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 bg-white flex flex-col min-h-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight break-words line-clamp-3">
              {recipe.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-shrink-0 leading-relaxed">
              {recipe.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-2 mb-3 flex-shrink-0">
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-200">
                <span className="text-base">⏱️</span>
                <span>{recipe.prepTime + recipe.cookTime}m</span>
              </span>
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-200">
                <span className="text-base">👥</span>
                <span>{recipe.servings}</span>
              </span>
            </div>

            {/* Category - Bottom */}
            <div className="mt-auto flex-shrink-0">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-white px-4 py-2 rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 transition-colors">
                <span className="text-base">🍽️</span>
                {recipe.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
