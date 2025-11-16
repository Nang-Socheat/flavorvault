import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const RecipeCard = ({ recipe }) => {
  const { isFavorite, toggleFavorite } = useApp();
  const isRecipeFavorite = isFavorite(recipe.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  return (
    <Link to={`/recipe/${recipe.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={recipe.image || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
            aria-label={isRecipeFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="text-xl">
              {isRecipeFavorite ? '❤️' : '🤍'}
            </span>
          </button>
          {/* Difficulty Badge */}
          <div className="absolute bottom-2 left-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
              recipe.difficulty === 'Easy' ? 'bg-green-500' :
              recipe.difficulty === 'Medium' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="mr-1">⏱️</span>
                {recipe.prepTime + recipe.cookTime} min
              </span>
              <span className="flex items-center">
                <span className="mr-1">👥</span>
                {recipe.servings}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {recipe.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
