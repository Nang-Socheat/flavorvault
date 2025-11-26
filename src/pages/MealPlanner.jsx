import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext'; 
import Select from 'react-select';
import { Link } from 'react-router-dom';

const MealPlanner = () => {
  const { recipes, getRecipeById, getMealPlan, saveMealPlan } = useApp();
  
  // Default meal plan structure
  const defaultMealPlan = {
    Monday: { breakfast: [], lunch: [], dinner: [] },
    Tuesday: { breakfast: [], lunch: [], dinner: [] },
    Wednesday: { breakfast: [], lunch: [], dinner: [] },
    Thursday: { breakfast: [], lunch: [], dinner: [] },
    Friday: { breakfast: [], lunch: [], dinner: [] },
    Saturday: { breakfast: [], lunch: [], dinner: [] },
    Sunday: { breakfast: [], lunch: [], dinner: [] },
  };

  const [mealPlan, setMealPlan] = useState(defaultMealPlan);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved meal plan from localStorage on component mount
  useEffect(() => {
    const savedMealPlan = getMealPlan();
    if (savedMealPlan) {
      setMealPlan(savedMealPlan);
    }
    setIsLoaded(true);
  }, [getMealPlan]);

  // Save meal plan to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveMealPlan(mealPlan);
    }
  }, [mealPlan, isLoaded, saveMealPlan]);

  const handleRecipeAssignment = (day, meal, recipeId) => {
    if (!mealPlan[day][meal].includes(recipeId)) {
      setMealPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: [...prev[day][meal], recipeId],
        },
      }));
    }
  };

  const handleRemoveRecipe = (day, meal, recipeId) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: prev[day][meal].filter(id => id !== recipeId),
      },
    }));
  };

  const handleRecipeSelection = (selectedOption, day, meal) => {
    if (selectedOption) {
      handleRecipeAssignment(day, meal, selectedOption.value);
    }
  };

  // Clear all meals for a specific day
  const clearDay = (day) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        breakfast: [],
        lunch: [],
        dinner: [],
      },
    }));
  };

  // Clear entire week
  const clearWeek = () => {
    if (window.confirm('Are you sure you want to clear the entire meal plan?')) {
      setMealPlan(defaultMealPlan);
    }
  };

 // Assign random recipes for a specific day
  const assignRandomRecipesForDay = (day) => {
    const breakfastRecipes = recipes.filter(recipe => 
      recipe.category === 'Breakfast' || 
      recipe.tags?.includes('breakfast')
    );
    
    const lunchRecipes = recipes.filter(recipe => 
      recipe.category === 'Salad' || 
      recipe.tags?.includes('lunch') ||
      (recipe.prepTime + recipe.cookTime) <= 30
    );
    
    const dinnerRecipes = recipes.filter(recipe => 
      recipe.category !== 'Breakfast' && 
      recipe.category !== 'Dessert'
    );

    const getRandomRecipe = (recipeArray) => {
      if (recipeArray.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * recipeArray.length);
      return recipeArray[randomIndex].id;
    };

    setMealPlan(prev => ({
      ...prev,
      [day]: {
        breakfast: [getRandomRecipe(breakfastRecipes)].filter(Boolean),
        lunch: [getRandomRecipe(lunchRecipes)].filter(Boolean),
        dinner: [getRandomRecipe(dinnerRecipes)].filter(Boolean),
      },
    }));
  };

  // Assign random recipe for specific meal in a day
  const assignRandomRecipeForMeal = (day, meal) => {
    let mealRecipes = recipes;
    
    if (meal === 'breakfast') {
      mealRecipes = recipes.filter(recipe => 
        recipe.category === 'Breakfast' || 
        recipe.tags?.includes('breakfast')
      );
    } else if (meal === 'lunch') {
      mealRecipes = recipes.filter(recipe => 
        recipe.category === 'Salad' || 
        recipe.tags?.includes('lunch') ||
        (recipe.prepTime + recipe.cookTime) <= 45
      );
    } else if (meal === 'dinner') {
      mealRecipes = recipes.filter(recipe => 
        recipe.category !== 'Breakfast' && 
        recipe.category !== 'Dessert'
      );
    }

    if (mealRecipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * mealRecipes.length);
      handleRecipeAssignment(day, meal, mealRecipes[randomIndex].id);
    }
  };


  const recipeOptions = recipes.map((recipe) => ({
    value: recipe.id,
    label: recipe.title,
  }));

  
  const customStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: '14px',
      minHeight: '38px',
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: '14px',
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  const handlePrintDay = (day) => {
    window.open(`/print-meal-plan/${day}`, '_blank');
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['breakfast', 'lunch', 'dinner'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Meal Planner</h1>
        <p className="text-gray-600">Plan your weekly meals - Changes are automatically saved</p>
        
        {/* Clear Week Button */}
        <div className="mt-4">
          <button
            onClick={clearWeek}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Clear Entire Week
          </button>
        </div>
      </div>

      {/* Meal Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-lg border border-gray-200 overflow-visible relative">
            {/* Day Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">{day}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => assignRandomRecipesForDay(day)}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                    title="Assign random recipes for day"
                  >
                    🎲 Day
                  </button>
                  <button
                    onClick={() => clearDay(day)}
                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded"
                    title="Clear day"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => handlePrintDay(day)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded "
                    title="Print day's meal plan"
                  >
                    🖨️
                  </button>
                </div>
              </div>
            </div>

            {/* Meals for the Day */}
            <div className="p-4 space-y-4">
              {meals.map((meal) => (
                <div key={meal} className="border border-gray-200 rounded p-3 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-700 capitalize text-sm">
                      {meal}
                    </h3>
                    <button
                      onClick={() => assignRandomRecipeForMeal(day, meal)}
                      className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded"
                      title="Assign random recipe"
                    >
                      🎲
                    </button>
                  </div>

                  {/* Recipe Selector - Fixed dropdown */}
                  <div className="mb-2 relative z-50">
                    <Select
                      options={recipeOptions}
                      onChange={(selectedOption) => handleRecipeSelection(selectedOption, day, meal)}
                      placeholder={`Add ${meal}...`}
                      isSearchable={true}
                      className="text-sm"
                      styles={customStyles}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>

                  {/* Assigned Recipes */}
                  <div className="space-y-3">
                    {mealPlan[day][meal].map((recipeId) => {
                      const recipe = getRecipeById(recipeId);
                      return (
                        <div key={recipeId} className="bg-gray-50 rounded p-2">
                          <div className="flex items-start space-x-3">
                            {/* Recipe Image */}
                            <div className="shrink-0 w-12 h-12 bg-gray-200 rounded overflow-hidden">
                              <img
                                src={recipe?.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                                alt={recipe?.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                }}
                              />
                            </div>
                            
                            {/* Recipe Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/recipe/${recipeId}`}
                                className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-1"
                              >
                                {recipe?.title}
                              </Link>
                              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                <span>{recipe?.category}</span>
                                <span>•</span>
                                <span>{recipe?.prepTime + recipe?.cookTime}min</span>
                                <span>•</span>
                                <span className={`px-1 rounded ${
                                  recipe?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                  recipe?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {recipe?.difficulty}
                                </span>
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveRecipe(day, meal, recipeId)}
                              className="text-red-500 hover:text-red-700 text-sm shrink-0"
                              title="Remove recipe"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;