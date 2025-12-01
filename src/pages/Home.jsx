import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import Food1 from '../assets/Food1.webp';
import Vegetables1 from '../assets/vegetables1.jpg';
import KhmerFood from '../assets/KhmerFood.jpg';
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

  // Get quick recipes (under 30 minutes total time)
  const quickRecipes = recipes
    .filter(r => (r.prepTime + r.cookTime) <= 30)
    .slice(0, 3);

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

      {/* Hero Section - Simplified and cleaner */}
      <div className="relative text-white py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Background Image with Animation */}
        <div className="absolute inset-0">
          <img
            src={Food1}
            alt="Delicious food spread"
            className="w-full h-full object-cover animate-[zoom_20s_ease-in-out_infinite]"
          />
        </div>
        {/* Clean overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 drop-shadow-2xl">
            Welcome to FlavorVault
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-10 drop-shadow-lg max-w-3xl mx-auto">
            Your personal recipe collection, beautifully organized
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5">
            <Link
              to="/recipes"
              onClick={() => window.scrollTo(0, 0)}
              className="bg-white text-blue-600 px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Browse Recipes
            </Link>
            <Link
              to="/add"
              className="bg-blue-600/90 backdrop-blur-sm text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Add Recipe
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section - Cleaner design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border border-gray-100">
            <div className="text-4xl md:text-5xl mb-3">📚</div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{totalRecipes}</div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Total Recipes</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border border-gray-100">
            <div className="text-4xl md:text-5xl mb-3">❤️</div>
            <div className="text-3xl md:text-4xl font-bold text-rose-600 mb-1">{totalFavorites}</div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Favorites</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border border-gray-100">
            <div className="text-4xl md:text-5xl mb-3">🏷️</div>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">{categoriesCount}</div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Categories</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border border-gray-100">
            <div className="text-4xl md:text-5xl mb-3">⏱️</div>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1">{avgPrepTime}</div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Avg. Time (min)</div>
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
                  onClick={() => window.scrollTo(0, 0)}
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
        </div>

        {/* Quick Recipes Section */}
        {quickRecipes.length > 0 && (
          <div className="mb-8 md:mb-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">⚡ Quick & Easy</h2>
                <p className="text-sm md:text-base text-orange-50">Ready in 30 minutes or less!</p>
              </div>
              <Link 
                to="/recipes" 
                onClick={() => {
                  // Ensure scroll to top when navigating
                  window.scrollTo(0, 0);
                }}
                className="text-white hover:text-orange-100 font-medium transition-colors mt-3 md:mt-0 underline"
              >
                <span className="md:hidden">View All Recipes →</span>
                <span className="hidden md:inline">View All Quick Recipes →</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {quickRecipes.map((recipe) => (
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
                onClick={() => window.scrollTo(0, 0)}
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

      {/* Keyframe Animations */}
      <style>{`
        @keyframes zoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

