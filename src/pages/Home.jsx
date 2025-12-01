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
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
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

        {/* Today's Meal Plan Section - Enhanced with Recipe Cards */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl md:text-4xl">📅</span>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-violet-700">Today's Meal Plan</h2>
                <p className="text-sm md:text-base text-gray-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <Link
              to="/meal-planner"
              className="mt-4 sm:mt-0 hidden sm:inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              View Full Planner
            </Link>
          </div>

          {hasMealsPlanned ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                {/* Breakfast */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 md:p-5 border-2 border-orange-200 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">🌅</span>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-orange-700">Breakfast</h3>
                        <p className="text-xs text-orange-600">Morning fuel</p>
                      </div>
                    </div>
                    {todayMeals.breakfast?.length > 0 && (
                      <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
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
                            className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group"
                          >
                            <div className="flex gap-3">
                              {recipe.image && (
                                <div className="w-20 h-20 flex-shrink-0">
                                  <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <div className="flex-1 py-2 pr-2 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">{recipe.title}</h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {recipe.prepTime + recipe.cookTime} min
                                  </span>
                                  {recipe.difficulty && (
                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
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
                          className="block text-center text-sm text-orange-600 hover:text-orange-700 font-semibold py-2"
                        >
                          +{todayMeals.breakfast.length - 2} more →
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm mb-2">No breakfast planned</p>
                      <Link to="/meal-planner" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                        Add recipes
                      </Link>
                    </div>
                  )}
                </div>

                {/* Lunch */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 md:p-5 border-2 border-blue-200 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">☀️</span>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-blue-700">Lunch</h3>
                        <p className="text-xs text-blue-600">Midday energy</p>
                      </div>
                    </div>
                    {todayMeals.lunch?.length > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
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
                            className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group"
                          >
                            <div className="flex gap-3">
                              {recipe.image && (
                                <div className="w-20 h-20 flex-shrink-0">
                                  <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <div className="flex-1 py-2 pr-2 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">{recipe.title}</h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {recipe.prepTime + recipe.cookTime} min
                                  </span>
                                  {recipe.difficulty && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
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
                          className="block text-center text-sm text-blue-600 hover:text-blue-700 font-semibold py-2"
                        >
                          +{todayMeals.lunch.length - 2} more →
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm mb-2">No lunch planned</p>
                      <Link to="/meal-planner" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Add recipes
                      </Link>
                    </div>
                  )}
                </div>

                {/* Dinner */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 md:p-5 border-2 border-purple-200 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">🌙</span>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-purple-700">Dinner</h3>
                        <p className="text-xs text-purple-600">Evening feast</p>
                      </div>
                    </div>
                    {todayMeals.dinner?.length > 0 && (
                      <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
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
                            className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group"
                          >
                            <div className="flex gap-3">
                              {recipe.image && (
                                <div className="w-20 h-20 flex-shrink-0">
                                  <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <div className="flex-1 py-2 pr-2 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">{recipe.title}</h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {recipe.prepTime + recipe.cookTime} min
                                  </span>
                                  {recipe.difficulty && (
                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
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
                          className="block text-center text-sm text-purple-600 hover:text-purple-700 font-semibold py-2"
                        >
                          +{todayMeals.dinner.length - 2} more →
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm mb-2">No dinner planned</p>
                      <Link to="/meal-planner" className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                        Add recipes
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile View Full Planner Button */}
              <div className="sm:hidden">
                <Link
                  to="/meal-planner"
                  className="flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg w-full"
                >
                  View Full Planner
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 md:p-12 text-center border-2 border-dashed border-gray-300">
              <span className="text-5xl md:text-6xl mb-4 block">📝</span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-3">No Meals Planned for Today</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start planning your meals to stay organized, save time, and eat healthier. It only takes a few minutes!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/meal-planner"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <span className="mr-2">📆</span>
                  Start Planning
                </Link>
                <Link
                  to="/recipes"
                  className="inline-flex items-center justify-center bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-300 hover:border-gray-400"
                >
                  <span className="mr-2">🔍</span>
                  Browse Recipes
                </Link>
              </div>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">💡</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">Save Time</h4>
                    <p className="text-xs text-gray-600">Plan ahead and reduce daily cooking stress</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🥗</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">Eat Better</h4>
                    <p className="text-xs text-gray-600">Balance your nutrition throughout the week</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">💰</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">Reduce Waste</h4>
                    <p className="text-xs text-gray-600">Shop smarter with a clear meal plan</p>
                  </div>
                </div>
              </div>
            </div>
          )}
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

