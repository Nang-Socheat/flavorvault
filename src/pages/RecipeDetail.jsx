import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipeById, isFavorite, toggleFavorite, deleteRecipe } = useApp();

  const recipe = getRecipeById(id);
  const isRecipeFavorite = isFavorite(id);

  const handleBack = () => {
    // Check if there's history to go back to, otherwise go to recipes
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // If no history, go to recipes page as fallback
      navigate('/recipes');
    }
  };

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Recipe Not Found</h2>
        <p className="text-gray-600 mb-6">
          The recipe you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/recipes"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Browse Recipes
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(id);
      navigate('/recipes');
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(id);
  };

  const handlePrint = () => {
     window.open(`/print/${recipe.id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          ← Back
        </button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Header */}
          <div className="relative h-96 bg-gray-200">
            <img
              src={recipe.image || 'https://via.placeholder.com/1200x400?text=No+Image'}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x400?text=No+Image';
              }}
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              {/* Print Button */}
             <button
                onClick={handlePrint}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
                title="Print Recipe"
              >
                <span className="text-2xl">🖨️</span>
              </button>
              <button
                onClick={handleToggleFavorite}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">
                  {isRecipeFavorite ? '❤️' : '🤍'}
                </span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title and Meta */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
                  <p className="text-gray-600 text-lg">{recipe.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {recipe.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                  recipe.difficulty === 'Easy' ? 'bg-green-500' :
                  recipe.difficulty === 'Medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  {recipe.difficulty}
                </span>
                {recipe.tags && recipe.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-gray-700">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">⏱️</span>
                  <div>
                    <div className="text-sm text-gray-500">Prep Time</div>
                    <div className="font-semibold">{recipe.prepTime} min</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🍳</span>
                  <div>
                    <div className="text-sm text-gray-500">Cook Time</div>
                    <div className="font-semibold">{recipe.cookTime} min</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">👥</span>
                  <div>
                    <div className="text-sm text-gray-500">Servings</div>
                    <div className="font-semibold">{recipe.servings}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🕐</span>
                  <div>
                    <div className="text-sm text-gray-500">Total Time</div>
                    <div className="font-semibold">{recipe.prepTime + recipe.cookTime} min</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients and Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Ingredients */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructions */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between">
              <Link
                to={`/edit/${recipe.id}`}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Edit Recipe
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Delete Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
