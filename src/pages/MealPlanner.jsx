import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';  // Import context for recipes and functions
import RecipeCard from '../components/RecipeCard';

const MealPlanner = () => {
  const { recipes, getRecipeById, getMealPlan, saveMealPlan } = useApp();  // Get the necessary functions and data from context
  const [mealPlan, setMealPlan] = useState({
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    Saturday: null,
    Sunday: null,
  });

  // Save the updated meal plan to localStorage when it changes
  useEffect(() => {
    console.log("Saving meal plan to localStorage:", mealPlan);
    saveMealPlan(mealPlan);
  }, [mealPlan, saveMealPlan]);

  // Load saved meal plan from localStorage on component mount
  useEffect(() => {
    const savedMealPlan = getMealPlan();
    console.log("Loaded meal plan from localStorage:", savedMealPlan);
    if (savedMealPlan) {
      setMealPlan(savedMealPlan);
    }
  }, [getMealPlan]);

  // Assign a random recipe to the day
  const assignRandomRecipe = (day) => {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    handleRecipeAssignment(day, randomRecipe.id);
  };

  // Assign a selected recipe to the day
  const handleRecipeAssignment = (day, recipeId) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: recipeId,
    }));
  };

  // Remove the recipe for the day
  const handleRemoveRecipe = (day) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: null,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Meal Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(mealPlan).map((day) => (
          <div key={day} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">{day}</h2>

            {/* Button to assign random recipe */}
            <button
              onClick={() => assignRandomRecipe(day)}
              className="bg-blue-500 text-white p-2 rounded-md mt-4"
            >
              Assign Random Recipe
            </button>

            {/* Dropdown to choose recipe */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a Recipe
              </label>
              <select
                onChange={(e) => handleRecipeAssignment(day, e.target.value)}
                value={mealPlan[day] || ""}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Select a Recipe --</option>
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Display selected recipe */}
            {mealPlan[day] ? (
              <div className="mt-4">
                <p>Recipe ID: {mealPlan[day]}</p>
                <button
                  onClick={() => handleRemoveRecipe(day)}
                  className="mt-2 text-red-500"
                >
                  Remove Recipe
                </button>
                <div>
                  {/* Display recipe details */}
                  <RecipeCard recipe={getRecipeById(mealPlan[day])} />
                </div>
              </div>
            ) : (
              <p className="mt-4 text-gray-600">No recipe assigned yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
