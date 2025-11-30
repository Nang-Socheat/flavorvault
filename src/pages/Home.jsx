import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import Food1 from '../assets/Food1.webp';
import Ingredients1 from '../assets/Ingredients1.webp';
import Vegetables1 from '../assets/vegetables1.jpg';
import KhmerFood from '../assets/KhmerFood.jpg';
import HealthyFood from '../assets/HealthyFood.jpg';
import Family from '../assets/Family.jpg';
import ChristmasDay from '../assets/ChristmasDay.jpg';
import Amok from '../assets/Amok.jpg';

const Home = () => {
  const { recipes, favorites } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // Get quick recipes (under 30 minutes total time)
  const quickRecipes = recipes
    .filter(r => (r.prepTime + r.cookTime) <= 30)
    .slice(0, 3);

  // Get category counts for all categories
  const categoryCounts = recipes.reduce((acc, recipe) => {
    acc[recipe.category] = (acc[recipe.category] || 0) + 1;
    return acc;
  }, {});

  const allCategories = Object.entries(categoryCounts)
    .filter(([category]) => category !== 'Khmer Food' && category !== 'Occasion') // Exclude duplicates
    .sort((a, b) => a[0].localeCompare(b[0])) // Sort alphabetically
    .map(([category, count]) => ({ category, count }));

  // Color schemes for categories
  const categoryColors = [
    'from-blue-500 via-blue-600 to-blue-700',
    'from-purple-500 via-purple-600 to-purple-700',
    'from-pink-500 via-pink-600 to-pink-700',
    'from-red-500 via-red-600 to-red-700',
    'from-orange-500 via-orange-600 to-orange-700',
    'from-yellow-500 via-yellow-600 to-yellow-700',
    'from-green-500 via-green-600 to-green-700',
    'from-teal-500 via-teal-600 to-teal-700',
    'from-cyan-500 via-cyan-600 to-cyan-700',
    'from-indigo-500 via-indigo-600 to-indigo-700',
    'from-violet-500 via-violet-600 to-violet-700',
    'from-fuchsia-500 via-fuchsia-600 to-fuchsia-700',
    'from-rose-500 via-rose-600 to-rose-700',
    'from-emerald-500 via-emerald-600 to-emerald-700',
  ];

  // Recipe of the Day (pseudo-random based on day)
  const recipeOfTheDay = recipes.length > 0
    ? recipes[new Date().getDate() % recipes.length]
    : null;

  // Most popular recipes (favorites)
  const popularRecipes = recipes
    .filter(r => favorites.includes(r.id))
    .slice(0, 3);

  // Get recipes by meal type
  const breakfastRecipes = recipes.filter(r => r.category === 'Breakfast').length;
  const lunchRecipes = recipes.filter(r => r.category === 'Lunch').length;
  const dinnerRecipes = recipes.filter(r => r.category === 'Dinner').length;
  const snackRecipes = recipes.filter(r => r.category === 'Snack').length;

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-purple-50">{/* Scroll to Top Button */}
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

      {/* Hero Section with Food Image */}
      <div className="relative text-white py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Image - Clear and Visible */}
        <div className="absolute inset-0">
          <img
            src={Food1}
            alt="Delicious food spread"
            className="w-full h-full object-cover animate-[zoom_20s_ease-in-out_infinite]"
          />
        </div>
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>

        <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 animate-[fadeInUp_0.8s_ease-out] drop-shadow-lg">
            Welcome to FlavorVault
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 animate-[fadeInUp_1s_ease-out] drop-shadow-md">
            Your personal recipe collection, beautifully organized
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 animate-[fadeInUp_1.2s_ease-out]">
            <Link
              to="/recipes"
              className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Browse Recipes
            </Link>
            <Link
              to="/add"
              className="bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Add Recipe
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="text-3xl md:text-4xl mb-2">📚</div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{totalRecipes}</div>
            <div className="text-sm md:text-base text-gray-700">Total Recipes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="text-3xl md:text-4xl mb-2">❤️</div>
            <div className="text-2xl md:text-3xl font-bold text-rose-600">{totalFavorites}</div>
            <div className="text-sm md:text-base text-gray-700">Favorites</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="text-3xl md:text-4xl mb-2">🏷️</div>
            <div className="text-2xl md:text-3xl font-bold text-purple-600">{categoriesCount}</div>
            <div className="text-sm md:text-base text-gray-700">Categories</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="text-3xl md:text-4xl mb-2">⏱️</div>
            <div className="text-2xl md:text-3xl font-bold text-orange-600">{avgPrepTime}</div>
            <div className="text-sm md:text-base text-gray-700">Avg. Time (min)</div>
          </div>
        </div>

        {/* Ingredients Showcase Section */}
        <div className="mb-8 md:mb-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden group">
              <img
                src={Ingredients1}
                alt="Fresh ingredients"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-700 mb-3 md:mb-4">
                Fresh Ingredients, Bold Flavors
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-slate-700 mb-4 md:mb-6">
                Discover recipes that celebrate the natural beauty and taste of quality ingredients.
                From exotic spices to fresh herbs, create culinary masterpieces that delight your senses.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/recipes"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 text-center shadow-md"
                >
                  Explore Recipes
                </Link>
                <Link
                  to="/add"
                  className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 text-center"
                >
                  Share Your Recipe
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories with Feature Images */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-6 text-center">Explore by Category</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Vegetables Image Card */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-64 md:h-80">
              <img
                src={Vegetables1}
                alt="Fresh vegetables"
                className="w-full h-full object-cover animate-[subtle-zoom_7s_ease-in-out_infinite] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">Healthy & Fresh</h3>
                <p className="text-sm md:text-base mb-4 drop-shadow-md">Discover nutritious recipes with fresh vegetables</p>
                <Link
                  to="/recipes"
                  className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
                >
                  View Recipes
                </Link>
              </div>
            </div>

            {/* Amok Image Card */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-64 md:h-80">
              <img
                src={Amok}
                alt="Khmer cuisine"
                className="w-full h-full object-cover animate-[subtle-zoom_9s_ease-in-out_infinite] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">Khmer Cuisine</h3>
                <p className="text-sm md:text-base mb-4 drop-shadow-md">Experience authentic Cambodian flavors</p>
                <Link
                  to="/recipes?category=Khmer Food"
                  className="inline-block bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-300 transform hover:scale-105"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Christmas/Occasion Image Card */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-64 md:h-80">
              <img
                src={ChristmasDay}
                alt="Special occasions"
                className="w-full h-full object-cover animate-[subtle-zoom_10s_ease-in-out_infinite] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">Special Occasions</h3>
                <p className="text-sm md:text-base mb-4 drop-shadow-md">Celebrate with memorable recipes</p>
                <Link
                  to="/recipes?category=Occasion"
                  className="inline-block bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                >
                  Discover
                </Link>
              </div>
            </div>
          </div>

          {/* Category Grid - All Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {allCategories.map(({ category, count }, index) => {
                const colorScheme = categoryColors[index % categoryColors.length];
                return (
                  <Link
                    key={category}
                    to={`/recipes?category=${category}`}
                    className={`relative bg-gradient-to-br ${colorScheme} rounded-2xl p-6 text-white transition-all duration-300 transform hover:scale-105 hover:-rotate-1 shadow-xl hover:shadow-2xl overflow-hidden group`}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="text-4xl mb-3 filter drop-shadow-lg transform group-hover:scale-110 transition-transform">
                        {categoryEmojis[category] || '🍽️'}
                      </div>
                      <h3 className="text-lg font-bold mb-1">{category}</h3>
                      <p className="text-sm opacity-90 font-medium">{count} recipe{count !== 1 ? 's' : ''}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Recipes Section */}
        {quickRecipes.length > 0 && (
          <div className="mb-8 md:mb-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">⚡ Quick & Easy</h2>
                <p className="text-sm md:text-base text-orange-50">Ready in 30 minutes or less!</p>
              </div>
              <Link to="/recipes" className="text-white hover:text-orange-100 font-medium transition-colors mt-3 md:mt-0 underline">
                View All Quick Recipes →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {quickRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {/* Healthy Eating Section with Image */}
        <div className="mb-8 md:mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">🥗 Healthy Living</h2>
            <p className="text-green-50 mb-4">
              Nourish your body with nutritious and delicious recipes. Balance flavor and health with fresh ingredients, vibrant colors, and wholesome meals that make you feel great.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-white font-medium">Fresh ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-white font-medium">Balanced nutrition</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-white font-medium">Full of flavor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-white font-medium">Easy to make</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl max-h-[400px]">
            <img
              src={HealthyFood}
              alt="Healthy fresh food"
              className="w-full h-full object-cover object-center animate-[subtle-zoom_8s_ease-in-out_infinite] hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Featured Recipes */}
        {featuredRecipes.length > 0 && (
          <div className="mb-8 md:mb-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-2">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Recently Added</h2>
                <p className="text-sm md:text-base text-teal-50">Check out our newest recipes</p>
              </div>
              <Link to="/recipes" className="text-white hover:text-teal-100 font-medium transition-colors underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions with Background Image */}
        <div className="mt-8 md:mt-12 relative rounded-lg shadow-2xl overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={KhmerFood}
              alt="Khmer cuisine background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/30 via-purple-700/30 to-pink-700/30"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center drop-shadow-lg">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <Link
                to="/recipes"
                className="flex items-center p-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="text-2xl md:text-3xl mr-3 md:mr-4 flex-shrink-0">🔍</span>
                <div>
                  <h3 className="font-semibold text-white text-sm md:text-base">Browse & Search</h3>
                  <p className="text-xs md:text-sm text-white/80">Find the perfect recipe</p>
                </div>
              </Link>
              <Link
                to="/favorites"
                className="flex items-center p-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="text-2xl md:text-3xl mr-3 md:mr-4 flex-shrink-0">❤️</span>
                <div>
                  <h3 className="font-semibold text-white text-sm md:text-base">My Favorites</h3>
                  <p className="text-xs md:text-sm text-white/80">Your saved recipes</p>
                </div>
              </Link>
              <Link
                to="/add"
                className="flex items-center p-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="text-2xl md:text-3xl mr-3 md:mr-4 flex-shrink-0 text-green-400">➕</span>
                <div>
                  <h3 className="font-semibold text-white text-sm md:text-base">Add New Recipe</h3>
                  <p className="text-xs md:text-sm text-white/80">Create your masterpiece</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
