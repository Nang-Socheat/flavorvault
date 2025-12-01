import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import MornDot from '../assets/MornDot.webp';
import NumBanhChok from '../assets/NumBanhChok.png';
import KhmerFood from '../assets/KhmerFood.jpg';
import HealthyFood from '../assets/HealthyFood.jpg';
import Ingredients3 from '../assets/Ingredients3.jpg';
import ChristmasDay from '../assets/ChristmasDay.jpg';
import Food1 from '../assets/Food1.jpg';
import Amok from '../assets/Amok.jpg';
import Family from '../assets/Family.jpg';
import Vegetables1 from '../assets/vegetables1.jpg';
import Ingredients1 from '../assets/Ingredients1.webp';

const MealPlanner = () => {
  const { recipes, getRecipeById, searchRecipes } = useApp();

  // View mode: 'day' or 'week'
  const [viewMode, setViewMode] = useState('day');

  // Current selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Meal plan storage: { 'YYYY-MM-DD': { breakfast: [], lunch: [], dinner: [], snack: [], special: [], occasion: [] } }
  const [mealPlan, setMealPlan] = useState(() => {
    // Initialize from localStorage
    const savedMealPlan = localStorage.getItem('enhancedMealPlan');
    return savedMealPlan ? JSON.parse(savedMealPlan) : {};
  });

  // Recipe selector modal
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectorConfig, setSelectorConfig] = useState({ date: '', mealType: '' });

  // Recipe search in selector
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState('all');
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [selectorViewMode, setSelectorViewMode] = useState('grid'); // 'grid' or 'compact'

  // Calendar picker
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  // Meal types with color coding
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'from-orange-400 to-yellow-300', bgColor: 'bg-orange-50', borderColor: 'border-orange-300', textColor: 'text-orange-700' },
    { id: 'lunch', label: 'Lunch', icon: '☀️', color: 'from-blue-400 to-cyan-300', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', textColor: 'text-blue-700' },
    { id: 'dinner', label: 'Dinner', icon: '🌙', color: 'from-purple-400 to-indigo-400', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', textColor: 'text-purple-700' },
  ];

  // Save meal plan to localStorage whenever it changes
  useEffect(() => {
    console.log('Saving meal plan to localStorage:', mealPlan);
    localStorage.setItem('enhancedMealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  // Update pickerDate when calendar opens
  useEffect(() => {
    if (showCalendarPicker) {
      setPickerDate(new Date(selectedDate));
    }
  }, [showCalendarPicker, selectedDate]);

  // Helper: Format date to YYYY-MM-DD
  const formatDateKey = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper: Format date for display
  const formatDisplayDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper: Get week dates from selected date
  const getWeekDates = (date) => {
    const current = new Date(date);
    const first = current.getDate() - current.getDay(); // First day is Sunday
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(current.getFullYear(), current.getMonth(), first + i);
      dates.push(day);
    }

    return dates;
  };

  // Navigation
  const goToToday = () => setSelectedDate(new Date());

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  // Print meal plan
  const handlePrintMealPlan = () => {
    const dateKey = formatDateKey(selectedDate);
    
    if (viewMode === 'day') {
      // Print single day - pass data via URL params
      const dayPlan = { [dateKey]: mealPlan[dateKey] || {} };
      const data = encodeURIComponent(JSON.stringify(dayPlan));
      const printUrl = `/print-meal-plan?mode=day&date=${dateKey}&data=${data}`;
      window.open(printUrl, '_blank');
    } else {
      // Print week view
      const weekDates = getWeekDates(selectedDate);
      const weekPlan = {};
      weekDates.forEach(date => {
        const key = formatDateKey(date);
        weekPlan[key] = mealPlan[key] || {};
      });
      const data = encodeURIComponent(JSON.stringify(weekPlan));
      const printUrl = `/print-meal-plan?mode=week&date=${dateKey}&data=${data}`;
      window.open(printUrl, '_blank');
    }
  };

  // Add meal to plan
  const addMealToPlan = (dateKey, mealType, recipeId, portions = 1) => {
    console.log('Adding meal:', { dateKey, mealType, recipeId, portions });
    setMealPlan(prev => {
      const newPlan = {
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [mealType]: [
            ...(prev[dateKey]?.[mealType] || []),
            { recipeId, portions, id: Date.now() + Math.random() }
          ]
        }
      };
      console.log('New meal plan after add:', newPlan);
      return newPlan;
    });
  };

  // Remove meal from plan
  const removeMealFromPlan = (dateKey, mealType, mealId) => {
    console.log('Removing meal:', { dateKey, mealType, mealId });
    setMealPlan(prev => {
      const newPlan = {
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [mealType]: prev[dateKey]?.[mealType]?.filter(meal => meal.id !== mealId) || []
        }
      };
      console.log('New meal plan after remove:', newPlan);
      return newPlan;
    });
  };

  // Update portions
  const updatePortions = (dateKey, mealType, mealId, newPortions) => {
    console.log('Updating portions:', { dateKey, mealType, mealId, newPortions });
    setMealPlan(prev => {
      const newPlan = {
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [mealType]: prev[dateKey]?.[mealType]?.map(meal =>
            meal.id === mealId ? { ...meal, portions: Math.max(1, newPortions) } : meal
          ) || []
        }
      };
      console.log('New meal plan after portions update:', newPlan);
      return newPlan;
    });
  };

  // Open recipe selector
  const openRecipeSelector = (date, mealType) => {
    setSelectorConfig({ date: formatDateKey(date), mealType });
    setShowRecipeSelector(true);
    setRecipeSearchQuery('');
    setRecipeCategoryFilter('all');
    setShowAllRecipes(false); // Reset to category-specific view
  };

  // Select recipe from modal - Allow multiple selections
  const selectRecipe = (recipeId) => {
    addMealToPlan(selectorConfig.date, selectorConfig.mealType, recipeId);
    // Don't close the modal - allow multiple selections
    // User can click X or Done button to close
  };

  // Get filtered recipes for selector
  const getFilteredRecipes = () => {
    // Get the current meal type being selected
    const currentMealType = selectorConfig.mealType;

    // Map meal types to recipe categories
    const mealTypeToCategoryMap = {
      'breakfast': 'Breakfast',
      'lunch': 'Lunch',
      'dinner': 'Dinner',
      'snack': 'Snack',
      'occasion': 'Occasion',
      'special': null // Special shows all categories
    };

    // Get the category to filter by (null for special = show all)
    const filterCategory = mealTypeToCategoryMap[currentMealType];

    // Get recipes using search
    let filteredRecipes = searchRecipes(recipeSearchQuery, { category: recipeCategoryFilter });

    // If showing all recipes OR special meal type, don't filter by category
    // Otherwise, prioritize category-specific recipes first
    if (!showAllRecipes && filterCategory !== null) {
      // When not showing all, only show category-specific recipes
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.category.toLowerCase() === filterCategory.toLowerCase()
      );
    } else if (showAllRecipes && filterCategory !== null) {
      // When showing all, sort to show category-specific first
      const categoryRecipes = filteredRecipes.filter(recipe =>
        recipe.category.toLowerCase() === filterCategory.toLowerCase()
      );
      const otherRecipes = filteredRecipes.filter(recipe =>
        recipe.category.toLowerCase() !== filterCategory.toLowerCase()
      );
      filteredRecipes = [...categoryRecipes, ...otherRecipes];
    }

    return filteredRecipes;
  };

  // Calendar picker navigation
  const goToPreviousMonth = () => {
    const newDate = new Date(pickerDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setPickerDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(pickerDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setPickerDate(newDate);
  };

  const handleDateSelect = (day) => {
    const currentMonth = pickerDate.getMonth();
    const currentYear = pickerDate.getFullYear();
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    setShowCalendarPicker(false);
  };

  // Render Day View
  const renderDayView = () => {
    const dateKey = formatDateKey(selectedDate);
    const dayPlan = mealPlan[dateKey] || {};
    const isToday = formatDateKey(new Date()) === dateKey;

    return (
      <div className="space-y-4">
        {/* Date Header */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-2xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">{formatDisplayDate(selectedDate)}</h2>
            {isToday && <span className="text-sm font-medium bg-white/30 px-3 py-1 rounded-full">Today</span>}
          </div>
        </div>

        {/* Meal Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4">
          {mealTypes.map(mealType => (
            <div key={mealType.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Meal Type Header */}
              <div className={`bg-gradient-to-r ${mealType.color} text-white px-4 py-3 rounded-lg mb-4 flex items-center justify-between shadow-md`}>
                <div className="flex items-center space-x-2">
                  <span className="text-xl md:text-2xl">{mealType.icon}</span>
                  <h3 className="text-base md:text-lg font-bold drop-shadow-md">{mealType.label}</h3>
                </div>
                <button
                  onClick={() => openRecipeSelector(selectedDate, mealType.id)}
                  className="bg-black/30 hover:bg-black/50 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-bold transition-colors"
                  title="Add recipe"
                >
                  + Add
                </button>
              </div>

              {/* Meals List */}
              <div className="space-y-3">
                {(dayPlan[mealType.id] || []).length > 0 ? (
                  (dayPlan[mealType.id] || []).map(meal => {
                    const recipe = getRecipeById(meal.recipeId);
                    if (!recipe) return null;

                    return (
                      <div key={meal.id} className="bg-gray-50 rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                        <div className="flex gap-3">
                          {/* Recipe Image */}
                          <Link to={`/recipe/${recipe.id}`} className="shrink-0">
                            <img
                              src={recipe.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                              alt={recipe.title}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                              }}
                            />
                          </Link>

                          {/* Recipe Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/recipe/${recipe.id}`}
                              className="font-bold text-gray-900 hover:underline line-clamp-1 text-sm md:text-base"
                            >
                              {recipe.title}
                            </Link>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                              {recipe.category} • {recipe.prepTime + recipe.cookTime} min
                            </p>

                            {/* Portions Control */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs md:text-sm text-gray-700 font-medium">Portions:</span>
                              <button
                                onClick={() => updatePortions(dateKey, mealType.id, meal.id, meal.portions - 1)}
                                className="w-6 h-6 md:w-7 md:h-7 bg-gray-300 hover:bg-gray-400 rounded text-sm font-bold text-gray-800"
                              >
                                -
                              </button>
                              <span className="text-sm md:text-base font-bold text-gray-900 w-6 md:w-8 text-center">{meal.portions}</span>
                              <button
                                onClick={() => updatePortions(dateKey, mealType.id, meal.id, meal.portions + 1)}
                                className="w-6 h-6 md:w-7 md:h-7 bg-gray-300 hover:bg-gray-400 rounded text-sm font-bold text-gray-800"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeMealFromPlan(dateKey, mealType.id, meal.id)}
                            className="text-red-500 hover:text-red-700 text-2xl md:text-3xl shrink-0 self-start font-bold"
                            title="Remove meal"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-400 py-2">
                    <p className="text-xs md:text-sm">No {mealType.label.toLowerCase()} planned</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    const weekDates = getWeekDates(selectedDate);
    const todayKey = formatDateKey(new Date());

    return (
      <div className="space-y-4">
        {/* Week Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-2xl shadow-xl border-2 border-orange-500/50">
            <h2 className="text-2xl font-bold">
              Week of {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-1 gap-4">
          {weekDates.map((date, index) => {
            const dateKey = formatDateKey(date);
            const dayPlan = mealPlan[dateKey] || {};
            const isToday = dateKey === todayKey;
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            return (
              <div
                key={dateKey}
                className={`bg-white rounded-xl border-2 ${isToday ? 'border-purple-500 shadow-lg' : 'border-gray-200'} overflow-hidden hover:shadow-xl transition-all duration-300`}
              >
                {/* Day Header */}
                <div className={`${isToday ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-b-2 border-gray-200'} px-6 py-4 flex items-center justify-between`}>
                  <div>
                    <h3 className="text-xl font-bold">{dayNames[index]}</h3>
                    <p className={`text-sm ${isToday ? 'text-white/90' : 'text-gray-600'}`}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {isToday && <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">Today</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDate(date);
                      setViewMode('day');
                    }}
                    className={`${isToday ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
                  >
                    View Day
                  </button>
                </div>

                {/* Meals Summary */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {mealTypes.map(mealType => {
                    const meals = dayPlan[mealType.id] || [];
                    const mealCount = meals.length;

                    return (
                      <div
                        key={mealType.id}
                        onClick={() => {
                          setSelectedDate(date);
                          setViewMode('day');
                        }}
                        className="bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">{mealType.icon}</span>
                          <span className="bg-gray-800 text-white text-sm font-bold px-2 py-1 rounded-full">
                            {mealCount}
                          </span>
                        </div>
                        <p className="text-gray-900 text-base font-bold mb-2">
                          {mealType.label}
                        </p>
                        {mealCount > 0 && (
                          <div className="mt-3 space-y-1">
                            {meals.slice(0, 2).map(meal => {
                              const recipe = getRecipeById(meal.recipeId);
                              return recipe ? (
                                <p key={meal.id} className="text-sm text-gray-700 truncate font-medium">
                                  • {recipe.title}
                                </p>
                              ) : null;
                            })}
                            {mealCount > 2 && (
                              <p className="text-sm text-gray-500 italic font-medium">+{mealCount - 2} more</p>
                            )}
                          </div>
                        )}
                        {mealCount === 0 && (
                          <p className="text-sm text-gray-400 italic mt-3">No meals</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Recipe Selector Modal
  const renderRecipeSelector = () => {
    if (!showRecipeSelector) return null;

    const filteredRecipes = getFilteredRecipes();
    const selectedMealType = mealTypes.find(mt => mt.id === selectorConfig.mealType);
    const categories = ['all', ...new Set(recipes.map(r => r.category))];

    // Determine if we're showing all recipes or filtered
    const isSpecial = selectorConfig.mealType === 'special';
    const categoryName = selectedMealType?.label;
    
    // Get current meal plan for the selected date and meal type
    const currentMeals = mealPlan[selectorConfig.date]?.[selectorConfig.mealType] || [];
    const selectedCount = currentMeals.length;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden">
          {/* Modal Header - Compact */}
          <div className={`bg-gradient-to-r ${selectedMealType?.color} text-white px-4 py-3 flex-shrink-0`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{selectedMealType?.icon}</span>
                <div>
                  <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                    Select Recipe for {selectedMealType?.label}
                    {selectedCount > 0 && (
                      <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
                        {selectedCount} selected
                      </span>
                    )}
                  </h2>
                  <p className="text-white/90 text-xs">
                    {new Date(selectorConfig.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRecipeSelector(false)}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={() => setShowRecipeSelector(false)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors text-2xl w-8 h-8 flex items-center justify-center shrink-0"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter - Compact */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Search recipes by name..."
                value={recipeSearchQuery}
                onChange={(e) => setRecipeSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <select
                value={recipeCategoryFilter}
                onChange={(e) => setRecipeCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
            
            {/* View Mode and Scroll to Top - Compact */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 py-1.5">
                <span className="text-xs font-medium text-gray-700">View:</span>
                <button
                  onClick={() => setSelectorViewMode('grid')}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                    selectorViewMode === 'grid'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🔲 Grid
                </button>
                <button
                  onClick={() => setSelectorViewMode('compact')}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                    selectorViewMode === 'compact'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📋 Compact
                </button>
              </div>

              {/* Scroll to Top Button */}
              <button
                onClick={() => {
                  const scrollContainer = document.getElementById('recipe-selector-scroll');
                  if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-700 transition-all flex items-center gap-1"
              >
                ↑ Scroll to Top
              </button>
            </div>
            
            {/* Show All Recipes Toggle - Improved Format */}
            {!isSpecial && (
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                <div className="flex-1 flex items-center gap-2">
                  <span className={`text-xs font-medium ${showAllRecipes ? 'text-purple-700' : 'text-gray-700'}`}>
                    {showAllRecipes ? '🌍 Showing all recipes' : `📌 ${categoryName} recipes only`}
                  </span>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {filteredRecipes.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAllRecipes(!showAllRecipes)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                    showAllRecipes 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {showAllRecipes ? '← Category Only' : 'Show All Recipes →'}
                </button>
              </div>
            )}
          </div>

          {/* Recipe Grid - Scrollable */}
          <div id="recipe-selector-scroll" className="flex-1 overflow-y-auto p-4">
            {/* Grid View */}
            {selectorViewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map(recipe => {
                  const isAdded = currentMeals.some(meal => meal.recipeId === recipe.id);
                  return (
                    <div
                      key={recipe.id}
                      onClick={() => selectRecipe(recipe.id)}
                      className={`bg-white border-2 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                        isAdded ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-purple-500'
                      }`}
                    >
                      {/* Recipe Image */}
                      <div className="h-40 overflow-hidden bg-gray-100 relative">
                        <img
                          src={recipe.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={recipe.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                          }}
                        />
                        {isAdded && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            ✓ Added
                          </div>
                        )}
                      </div>

                      {/* Recipe Info */}
                      <div className="p-3">
                        <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2" title={recipe.title}>
                          {recipe.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 flex-wrap">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{recipe.category}</span>
                          <span>•</span>
                          <span>{recipe.prepTime + recipe.cookTime} min</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded ${
                            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {recipe.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{recipe.description}</p>

                        {/* Add Button */}
                        <button className={`mt-3 w-full ${isAdded ? 'bg-green-600' : `bg-gradient-to-r ${selectedMealType?.color}`} text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm`}>
                          {isAdded ? '✓ Added - Click to Add Again' : `Add to ${selectedMealType?.label}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Compact View */}
            {selectorViewMode === 'compact' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {filteredRecipes.map(recipe => {
                  const isAdded = currentMeals.some(meal => meal.recipeId === recipe.id);
                  return (
                    <div
                      key={recipe.id}
                      onClick={() => selectRecipe(recipe.id)}
                      className={`bg-white border-2 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${
                        isAdded ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-purple-500'
                      }`}
                    >
                      {/* Recipe Image */}
                      <div className="h-24 overflow-hidden bg-gray-100 relative">
                        <img
                          src={recipe.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                          }}
                        />
                        {/* Status Badge */}
                        {isAdded ? (
                          <span className="absolute top-1 right-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            recipe.difficulty === 'Easy' ? 'bg-green-600 text-white' :
                            recipe.difficulty === 'Medium' ? 'bg-yellow-600 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {recipe.difficulty}
                          </span>
                        )}
                      </div>

                      {/* Recipe Info */}
                      <div className="p-2">
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1" title={recipe.title}>
                          {recipe.title}
                        </h3>
                        <div className="flex items-center justify-between text-[10px] text-gray-600">
                          <span className="truncate">{recipe.category}</span>
                          <span className="font-medium whitespace-nowrap">⏱️ {recipe.prepTime + recipe.cookTime}m</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No recipes found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Calendar Picker Modal
  const renderCalendarPicker = () => {
    if (!showCalendarPicker) return null;

    const currentMonth = pickerDate.getMonth();
    const currentYear = pickerDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Prev
            </button>
            <h3 className="text-xl font-bold text-gray-800">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={goToNextMonth}
              className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = formatDateKey(new Date(currentYear, currentMonth, day));
              const isToday = dateKey === formatDateKey(new Date());
              const isSelected = dateKey === formatDateKey(selectedDate);
              const hasMeals = mealPlan[dateKey] && Object.values(mealPlan[dateKey]).some(meals => meals && meals.length > 0);

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all duration-200
                    ${isToday ? 'bg-purple-500 text-white hover:bg-purple-600' : ''}
                    ${isSelected && !isToday ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                    ${!isToday && !isSelected ? 'hover:bg-gray-100 text-gray-800' : ''}
                    ${hasMeals && !isToday && !isSelected ? 'bg-green-50 border-2 border-green-300' : ''}
                  `}
                >
                  {day}
                  {hasMeals && !isToday && !isSelected && (
                    <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-0.5"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setShowCalendarPicker(false);
              }}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Go to Today
            </button>
            <button
              onClick={() => setShowCalendarPicker(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50 pb-0">
      {/* Simple Background Pattern */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none z-0 animate-gradient"
        style={{
          backgroundImage: `url(${Vegetables1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-4 md:py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 md:mb-3 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
            🍽️ Meal Planner
          </h1>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg font-semibold">Plan your delicious meals - Automatically saved!</p>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm w-full md:w-auto">
              <button
                onClick={() => setViewMode('day')}
                className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm md:text-base font-semibold transition-all duration-200 ${
                  viewMode === 'day'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                📅 Day View
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm md:text-base font-semibold transition-all duration-200 ${
                  viewMode === 'week'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                📆 Week View
              </button>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center w-full md:w-auto">
              <button
                onClick={viewMode === 'day' ? goToPreviousDay : goToPreviousWeek}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition-colors shadow-sm border border-gray-300"
              >
                ← Previous
              </button>

              <button
                onClick={goToToday}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold hover:shadow-md transition-all"
              >
                Today
              </button>

              <button
                onClick={() => setShowCalendarPicker(true)}
                className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold hover:shadow-md transition-all"
              >
                📅 Pick Date
              </button>

              <button
                onClick={viewMode === 'day' ? goToNextDay : goToNextWeek}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition-colors shadow-sm border border-gray-300"
              >
                Next →
              </button>
              
              {/* Only show Print button in Day View */}
              {viewMode === 'day' && (
                <button
                  onClick={handlePrintMealPlan}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold hover:shadow-lg transition-all"
                  title="Print today's meal plan"
                >
                  🖨️ Print
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200">
          {viewMode === 'day' ? renderDayView() : renderWeekView()}
        </div>
      </div>

      {/* Modals */}
      {renderRecipeSelector()}
      {renderCalendarPicker()}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(-10px); }
        }

        @keyframes slowZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-floatSlow {
          animation: floatSlow 12s ease-in-out infinite;
        }

        .animate-slowZoom {
          animation: slowZoom 25s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }

        .animate-slideInLeft {
          animation: slideInLeft 15s ease-in-out infinite;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MealPlanner;
