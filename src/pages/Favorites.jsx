import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';
import { useEffect } from 'react';

const Favorites = () => {
  const { getFavoriteRecipes } = useApp();
  const favoriteRecipes = getFavoriteRecipes();

  // Scroll to specific recipe card when returning from recipe detail
  useEffect(() => {
    const lastViewedRecipeId = sessionStorage.getItem('lastViewedRecipeId');
    const sourcePage = sessionStorage.getItem('recipeSourcePage');
    
    if (lastViewedRecipeId && sourcePage === 'favorites') {
      console.log('Attempting to scroll to recipe in Favorites:', lastViewedRecipeId);
      
      // Wait for DOM to render
      const timer = setTimeout(() => {
        const recipeCard = document.querySelector(`[data-recipe-id="${lastViewedRecipeId}"]`);
        console.log('Recipe card found in Favorites:', recipeCard);
        
        if (recipeCard) {
          // Scroll to the recipe card with some offset for better visibility
          const offset = 100; // pixels from top
          const elementPosition = recipeCard.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;
          
          console.log('Scrolling to position:', offsetPosition);
          // Use instant scroll for immediate landing
          window.scrollTo({
            top: offsetPosition,
            behavior: 'auto'
          });
        } else {
          console.warn('Recipe card not found in Favorites for ID:', lastViewedRecipeId);
        }
        // Clean up after scrolling
        sessionStorage.removeItem('lastViewedRecipeId');
        sessionStorage.removeItem('recipeSourcePage');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
      <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-4 animate-[fadeInUp_0.6s_ease-out]">
            My Favorites ❤️
          </h1>
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
              <div key={recipe.id} data-recipe-id={recipe.id}>
                <RecipeCard recipe={recipe} sourcePage="favorites" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center transform transition-all duration-300 hover:shadow-2xl">
          <div className="text-6xl mb-4 animate-pulse">💔</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 animate-[fadeInUp_0.8s_ease-out]">
            No favorites yet
          </h3>
          <p className="text-gray-600 mb-6 animate-[fadeInUp_1s_ease-out]">
            Start adding recipes to your favorites by clicking the heart icon on any recipe card
          </p>
          <Link
            to="/recipes"
            className="inline-block bg-gradient-to-r from-pink-600 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg animate-[fadeInUp_1.2s_ease-out]"
          >
            Browse Recipes
          </Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default Favorites;
