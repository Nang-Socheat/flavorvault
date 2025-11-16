import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  const { recipes, favorites } = useApp();

  // Calculate stats
  const totalRecipes = recipes.length;
  const totalFavorites = favorites.length;

  // Get categories count
  const categories = [...new Set(recipes.map(r => r.category))];
  const categoriesCount = categories.length;

  // Get average prep time
  const avgPrepTime = recipes.length > 0
    ? Math.round(recipes.reduce((sum, r) => sum + r.prepTime + r.cookTime, 0) / recipes.length)
    : 0;

  // Get featured recipes (most recent 3)
  const featuredRecipes = recipes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to FlavorVault</h1>
          <p className="text-xl mb-8">Your personal recipe collection, beautifully organized</p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/recipes"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Recipes
            </Link>
            <Link
              to="/add"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Add Recipe
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-gray-800">{totalRecipes}</div>
            <div className="text-gray-600">Total Recipes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2">❤️</div>
            <div className="text-3xl font-bold text-gray-800">{totalFavorites}</div>
            <div className="text-gray-600">Favorites</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2">🏷️</div>
            <div className="text-3xl font-bold text-gray-800">{categoriesCount}</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-3xl font-bold text-gray-800">{avgPrepTime}</div>
            <div className="text-gray-600">Avg. Time (min)</div>
          </div>
        </div>

        {/* Featured Recipes */}
        {featuredRecipes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Recently Added</h2>
              <Link to="/recipes" className="text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/recipes"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-3xl mr-4">🔍</span>
              <div>
                <h3 className="font-semibold text-gray-800">Browse & Search</h3>
                <p className="text-sm text-gray-600">Find the perfect recipe</p>
              </div>
            </Link>
            <Link
              to="/favorites"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-3xl mr-4">❤️</span>
              <div>
                <h3 className="font-semibold text-gray-800">My Favorites</h3>
                <p className="text-sm text-gray-600">Your saved recipes</p>
              </div>
            </Link>
            <Link
              to="/add"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-3xl mr-4">➕</span>
              <div>
                <h3 className="font-semibold text-gray-800">Add New Recipe</h3>
                <p className="text-sm text-gray-600">Create your masterpiece</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
