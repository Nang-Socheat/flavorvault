import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';

const Favorites = () => {
  const { getFavoriteRecipes } = useApp();
  const favoriteRecipes = getFavoriteRecipes();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">My Favorites</h1>
        <p className="text-gray-600">
          Your collection of favorite recipes, all in one place
        </p>
      </div>

      {/* Content */}
      {favoriteRecipes.length > 0 ? (
        <div>
          <div className="mb-4">
            <p className="text-gray-600">
              You have <span className="font-semibold">{favoriteRecipes.length}</span> favorite recipe
              {favoriteRecipes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start adding recipes to your favorites by clicking the heart icon on any recipe card
          </p>
          <Link
            to="/recipes"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
