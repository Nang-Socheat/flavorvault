import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState, useEffect, useMemo } from 'react';
import RecipeCard from '../components/RecipeCard';
import Food1 from '../assets/Food1.webp';
import Vegetables1 from '../assets/vegetables1.jpg';
import KhmerFood from '../assets/KhmerFood.jpg';
import Family from '../assets/Family.jpg';
import ChristmasDay from '../assets/ChristmasDay.jpg';
import Amok from '../assets/Amok.jpg';

const Home = () => {
  const { recipes, favorites, getRecipeById } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Get meal plan from localStorage
  const mealPlan = useMemo(() => {
    const saved = localStorage.getItem('enhancedMealPlan');
    return saved ? JSON.parse(saved) : {};
  }, []);

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

  // Get today's meal plan
  const formatDateKey = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = formatDateKey(new Date());
  const todayMeals = mealPlan[today] || { breakfast: [], lunch: [], dinner: [] };

  const hasMealsPlanned = todayMeals.breakfast?.length > 0 || 
                          todayMeals.lunch?.length > 0 || 
                          todayMeals.dinner?.length > 0;

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-purple-50">
      {/* Scroll to Top Button */}
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

      {/* Hero Section */}
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

        <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 text-center relative z-10">
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

      {/* Main Content Container with max-width */}
      <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-6 md:py-8">
        {/* Stats Section - Enhanced */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {/* Total Recipes Card */}
          <div className="group relative bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 rounded-2xl shadow-lg p-6 md:p-8 text-center transform hover:-translate-y-3 transition-all duration-300 hover:shadow-2xl border-2 border-blue-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-3xl md:text-4xl">📚</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-blue-700 mb-2 group-hover:scale-110 transition-transform">{totalRecipes}</div>
              <div className="text-sm md:text-base text-blue-800 font-bold uppercase tracking-wide">Total Recipes</div>
            </div>
          </div>

          {/* Favorites Card */}
          <div className="group relative bg-gradient-to-br from-rose-50 via-pink-100 to-red-100 rounded-2xl shadow-lg p-6 md:p-8 text-center transform hover:-translate-y-3 transition-all duration-300 hover:shadow-2xl border-2 border-rose-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400/0 to-red-600/0 group-hover:from-rose-400/10 group-hover:to-red-600/10 transition-all duration-300"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-rose-500 to-red-700 rounded-2xl shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-3xl md:text-4xl">❤️</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-rose-700 mb-2 group-hover:scale-110 transition-transform">{totalFavorites}</div>
              <div className="text-sm md:text-base text-rose-800 font-bold uppercase tracking-wide">Favorites</div>
            </div>
          </div>

          {/* Categories Card */}
          <div className="group relative bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 rounded-2xl shadow-lg p-6 md:p-8 text-center transform hover:-translate-y-3 transition-all duration-300 hover:shadow-2xl border-2 border-purple-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-violet-600/0 group-hover:from-purple-400/10 group-hover:to-violet-600/10 transition-all duration-300"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-violet-700 rounded-2xl shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-3xl md:text-4xl">🏷️</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-purple-700 mb-2 group-hover:scale-110 transition-transform">{categoriesCount}</div>
              <div className="text-sm md:text-base text-purple-800 font-bold uppercase tracking-wide">Categories</div>
            </div>
          </div>

          {/* Average Time Card */}
          <div className="group relative bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-100 rounded-2xl shadow-lg p-6 md:p-8 text-center transform hover:-translate-y-3 transition-all duration-300 hover:shadow-2xl border-2 border-orange-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-amber-600/0 group-hover:from-orange-400/10 group-hover:to-amber-600/10 transition-all duration-300"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-amber-700 rounded-2xl shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-3xl md:text-4xl">⏱️</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-orange-700 mb-2 group-hover:scale-110 transition-transform">{avgPrepTime}</div>
              <div className="text-sm md:text-base text-orange-800 font-bold uppercase tracking-wide">Avg. Time (min)</div>
            </div>
          </div>
        </div>

        {/* Today's Meal Plan Section - Enhanced with Recipe Cards */}
        <div className="mb-12 md:mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-2 border-violet-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl p-3 md:p-4 shadow-lg">
                  <span className="text-3xl md:text-4xl">📅</span>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
                    Today's Meal Plan
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 font-medium">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <Link
                to="/meal-planner"
                className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 md:px-7 py-3 md:py-3.5 rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>📋</span>
                <span>View Planner</span>
              </Link>
            </div>

          {hasMealsPlanned ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                {/* Breakfast */}
                <div className="group bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 rounded-2xl p-5 md:p-6 border-2 border-orange-300 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl p-2.5 shadow-md group-hover:scale-110 transition-transform">
                        <span className="text-3xl">🌅</span>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-orange-800">Breakfast</h3>
                        <p className="text-sm text-orange-600 font-medium">Morning fuel</p>
                      </div>
                    </div>
                    {todayMeals.breakfast?.length > 0 && (
                      <span className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                        {todayMeals.breakfast.length}
                      </span>
                    )}
                  </div>
                  
                  {todayMeals.breakfast?.length > 0 ? (
                    <div className="space-y-3">
                      {todayMeals.breakfast.slice(0, 2).map((recipeId) => {
                        const recipe = getRecipeById(recipeId);
                        return recipe ? (
                          <Link
                            key={recipeId}
                            to={`/recipe/${recipeId}`}
                            onClick={() => {
                              sessionStorage.setItem('lastViewedRecipeId', recipeId);
                              sessionStorage.setItem('recipeSourcePage', 'home');
                            }}
                            className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group/card border border-orange-200 hover:border-orange-400"
                          >
                            <div className="flex gap-3">
                              {recipe.image && (
                                <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                                  <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                                  />
                                </div>
                              )}
                              <div className="flex-1 py-3 pr-3 min-w-0">
                                <h4 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover/card:text-orange-700 transition-colors">
                                  {recipe.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {recipe.prepTime + recipe.cookTime} min
                                  </span>
                                  {recipe.difficulty && (
                                    <span className={`px-2.5 py-1 rounded-md font-bold ${
                                      recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                      recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {recipe.difficulty}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ) : null;
                      })}
                      {todayMeals.breakfast.length > 2 && (
                        <Link
                          to="/meal-planner"
                          className="flex items-center justify-center gap-2 text-center text-base text-orange-700 hover:text-orange-800 font-bold py-3 bg-orange-100 rounded-xl hover:bg-orange-200 transition-all"
                        >
                          <span>+{todayMeals.breakfast.length - 2} more</span>
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl border-2 border-dashed border-orange-300">
                      <div className="text-4xl mb-3">🍳</div>
                      <p className="text-sm font-semibold mb-3">No breakfast planned</p>
                      <Link 
                        to="/meal-planner" 
                        className="inline-flex items-center gap-2 text-sm text-orange-700 hover:text-orange-800 font-bold bg-orange-100 px-4 py-2 rounded-lg hover:bg-orange-200 transition-all"
                      >
                        <span>+</span>
                        <span>Add recipes</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Lunch */}
                <div className="group bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl p-5 md:p-6 border-2 border-blue-300 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl p-2.5 shadow-md group-hover:scale-110 transition-transform">
                        <span className="text-3xl">☀️</span>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-blue-800">Lunch</h3>
                        <p className="text-sm text-blue-600 font-medium">Midday energy</p>
                      </div>
                    </div>
                    {todayMeals.lunch?.length > 0 && (
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                        {todayMeals.lunch.length}
                      </span>
                    )}
                  </div>
                  
                  {todayMeals.lunch?.length > 0 ? (
                    <div className="space-y-3">
                      {todayMeals.lunch.slice(0, 2).map((recipeId) => {
                        const recipe = getRecipeById(recipeId);
                        return recipe ? (
                          <Link
                            key={recipeId}
                            to={`/recipe/${recipeId}`}
                            onClick={() => {
                              sessionStorage.setItem('lastViewedRecipeId', recipeId);
                              sessionStorage.setItem('recipeSourcePage', 'home');
                            }}
                            className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group/card border border-blue-200 hover:border-blue-400"
                          >
                            <div className="flex gap-3">
                              {recipe.image && (
                                <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                                  <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                                  />
                                </div>
                              )}
                              <div className="flex-1 py-3 pr-3 min-w-0">
                                <h4 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover/card:text-blue-700 transition-colors">
                                  {recipe.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {recipe.prepTime + recipe.cookTime} min
                                  </span>
                                  {recipe.difficulty && (
                                    <span className={`px-2.5 py-1 rounded-md font-bold ${
                                      recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                      recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {recipe.difficulty}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ) : null;
                      })}
                      {todayMeals.lunch.length > 2 && (
                        <Link
                          to="/meal-planner"
                          className="flex items-center justify-center gap-2 text-center text-base text-blue-700 hover:text-blue-800 font-bold py-3 bg-blue-100 rounded-xl hover:bg-blue-200 transition-all"
                        >
                          <span>+{todayMeals.lunch.length - 2} more</span>
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl border-2 border-dashed border-blue-300">
                      <div className="text-4xl mb-3">🥗</div>
                      <p className="text-sm font-semibold mb-3">No lunch planned</p>
                      <Link 
                        to="/meal-planner" 
                        className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 font-bold bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all"
                      >
                        <span>+</span>
                        <span>Add recipes</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Dinner */}
                <div className="group bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 rounded-2xl p-5 md:p-6 border-2 border-purple-300 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl p-2.5 shadow-md group-hover:scale-110 transition-transform">
                        <span className="text-3xl">🌙</span>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-purple-800">Dinner</h3>
                        <p className="text-sm text-purple-600 font-medium">Evening feast</p>
                      </div>
                    </div>
                    {todayMeals.dinner?.length > 0 && (
                      <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                        {todayMeals.dinner.length}
                      </span>
                    )}
                  </div>
                  
                  {todayMeals.dinner?.length > 0 ? (
                    <div className="space-y-3">
                      {todayMeals.dinner.slice(0, 2).map((recipeId) => {
                        const recipe = getRecipeById(recipeId);
                        return recipe ? (
                          <Link
                            key={recipeId}
                            to={`/recipe/${recipeId}`}
                            onClick={() => {
                              sessionStorage.setItem('lastViewedRecipeId', recipeId);
                              sessionStorage.setItem('recipeSourcePage', 'home');
                            }}
                            className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group/card border border-purple-200 hover:border-purple-400"
                          >
                            <div className="flex gap-3">
                              {recipe.image && (
                                <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                                  <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                                  />
                                </div>
                              )}
                              <div className="flex-1 py-3 pr-3 min-w-0">
                                <h4 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover/card:text-purple-700 transition-colors">
                                  {recipe.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {recipe.prepTime + recipe.cookTime} min
                                  </span>
                                  {recipe.difficulty && (
                                    <span className={`px-2.5 py-1 rounded-md font-bold ${
                                      recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                      recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {recipe.difficulty}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ) : null;
                      })}
                      {todayMeals.dinner.length > 2 && (
                        <Link
                          to="/meal-planner"
                          className="flex items-center justify-center gap-2 text-center text-base text-purple-700 hover:text-purple-800 font-bold py-3 bg-purple-100 rounded-xl hover:bg-purple-200 transition-all"
                        >
                          <span>+{todayMeals.dinner.length - 2} more</span>
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl border-2 border-dashed border-purple-300">
                      <div className="text-4xl mb-3">🍽️</div>
                      <p className="text-sm font-semibold mb-3">No dinner planned</p>
                      <Link 
                        to="/meal-planner" 
                        className="inline-flex items-center gap-2 text-sm text-purple-700 hover:text-purple-800 font-bold bg-purple-100 px-4 py-2 rounded-lg hover:bg-purple-200 transition-all"
                      >
                        <span>+</span>
                        <span>Add recipes</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 text-center border-2 border-dashed border-violet-300 shadow-inner">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 md:p-10">
                <span className="text-6xl md:text-7xl mb-5 block animate-bounce">📝</span>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent mb-4">
                  No Meals Planned for Today
                </h3>
                <p className="text-gray-700 text-base md:text-lg mb-8 max-w-2xl mx-auto font-medium">
                  Start planning your meals to stay organized, save time, and eat healthier. Create your perfect meal plan in just a few clicks!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                  <Link
                    to="/meal-planner"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="text-2xl">📆</span>
                    <span>Start Planning</span>
                  </Link>
                  <Link
                    to="/recipes"
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all border-2 border-violet-300 hover:border-violet-400 shadow-md hover:shadow-lg"
                  >
                    <span className="text-2xl">🔍</span>
                    <span>Browse Recipes</span>
                  </Link>
                </div>
                
                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <span className="text-3xl">💡</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">Save Time</h4>
                        <p className="text-sm text-gray-600">Plan ahead and reduce daily cooking stress</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 rounded-lg p-2">
                        <span className="text-3xl">🥗</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">Eat Better</h4>
                        <p className="text-sm text-gray-600">Balance your nutrition throughout the week</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 rounded-lg p-2">
                        <span className="text-3xl">💰</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">Reduce Waste</h4>
                        <p className="text-sm text-gray-600">Shop smarter with a clear meal plan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Popular Categories with Feature Images */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-6 text-center">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Vegetables Image Card */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-64 md:h-72">
              <img
                src={Vegetables1}
                alt="Fresh vegetables"
                className="w-full h-full object-cover animate-[subtle-zoom_7s_ease-in-out_infinite] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">Healthy & Fresh</h3>
                <p className="text-xs md:text-sm mb-3 md:mb-4 drop-shadow-md">Discover nutritious recipes with fresh vegetables</p>
                <Link
                  to="/recipes"
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-block bg-white text-green-600 px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
                >
                  View Recipes
                </Link>
              </div>
            </div>

            {/* Amok Image Card */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-64 md:h-72">
              <img
                src={Amok}
                alt="Khmer cuisine"
                className="w-full h-full object-cover animate-[subtle-zoom_9s_ease-in-out_infinite] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">Khmer Cuisine</h3>
                <p className="text-xs md:text-sm mb-3 md:mb-4 drop-shadow-md">Experience authentic Cambodian flavors</p>
                <Link
                  to="/recipes?category=Khmer Food"
                  className="inline-block bg-white text-orange-600 px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold hover:bg-orange-50 transition-all duration-300 transform hover:scale-105"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Christmas/Occasion Image Card */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-64 md:h-72">
              <img
                src={ChristmasDay}
                alt="Special occasions"
                className="w-full h-full object-cover animate-[subtle-zoom_10s_ease-in-out_infinite] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">Special Occasions</h3>
                <p className="text-xs md:text-sm mb-3 md:mb-4 drop-shadow-md">Celebrate with memorable recipes</p>
                <Link
                  to="/recipes?category=Occasion"
                  className="inline-block bg-white text-red-600 px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                >
                  Discover
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Recipes Section */}
        {quickRecipes.length > 0 && (
          <div className="mb-12 md:mb-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">⚡ Quick & Easy</h2>
                <p className="text-sm md:text-base text-orange-50">Ready in 30 minutes or less!</p>
              </div>
              <Link 
                to="/recipes" 
                onClick={() => window.scrollTo(0, 0)}
                className="text-white hover:text-orange-100 font-medium transition-colors mt-3 sm:mt-0 underline text-sm md:text-base"
              >
                View All Quick Recipes →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {quickRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions with Background Image */}
        <div className="relative rounded-xl shadow-2xl overflow-hidden">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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

