import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';

const MealPlanner = () => {
  const { recipes, getRecipeById, getMealPlan, saveMealPlan } = useApp();
  const [mealPlan, setMealPlan] = useState({
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    Saturday: null,
    Sunday: null,
  });

  useEffect(() => {
    const savedMealPlan = getMealPlan();
    if (savedMealPlan) {
        setMealPlan(savedMealPlan);
    }
  }, [getMealPlan]);

  useEffect(() => {
    saveMealPlan(mealPlan);
  }, [mealPlan, saveMealPlan]); 

  const handleRecipeAssignment = (day, recipeId) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: recipeId
    }));
  };

  const assignRandomRecipe = (day) => {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    handleRecipeAssignment(day, randomRecipe.id);
  };

  const handleRemoveRecipe = (day) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: null
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Meal Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(mealPlan).map(day => (
          <div key={day} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">{day}</h2>
            <button 
              onClick={() => assignRandomRecipe(day)} 
              className="bg-blue-500 text-white p-2 rounded-md mt-4">
              Assign Random Recipe
            </button>
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