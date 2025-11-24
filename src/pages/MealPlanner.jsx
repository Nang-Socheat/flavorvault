import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext'; 
import RecipeCard from '../components/RecipeCard';
import Select from 'react-select';

const MealPlanner = () => {
  const { recipes, getRecipeById, getMealPlan, saveMealPlan } = useApp();
  const [mealPlan, setMealPlan] = useState({
    Monday: { breakfast: [], lunch: [], dinner: [] },
    Tuesday: { breakfast: [], lunch: [], dinner: [] },
    Wednesday: { breakfast: [], lunch: [], dinner: [] },
    Thursday: { breakfast: [], lunch: [], dinner: [] },
    Friday: { breakfast: [], lunch: [], dinner: [] },
    Saturday: { breakfast: [], lunch: [], dinner: [] },
    Sunday: { breakfast: [], lunch: [], dinner: [] },
  });

  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  useEffect(() => {
    const savedMealPlan = getMealPlan();
    if (savedMealPlan) {
      setMealPlan(savedMealPlan);
    }
  }, [getMealPlan]);

  useEffect(() => {
    saveMealPlan(mealPlan);
  }, [mealPlan, saveMealPlan]);

  const handleSearch = (query) => {
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().startsWith(query.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

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

  const recipeOptions = filteredRecipes.map((recipe) => ({
    value: recipe.id,
    label: recipe.title,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Meal Planner</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Object.keys(mealPlan).map((day) => (
          <div key={day} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">{day}</h2>

            {['breakfast', 'lunch', 'dinner'].map((meal) => (
              <div key={meal} className="mt-4">
                <h3 className="text-lg font-semibold">{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>

                <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                  Assign Recipe to {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </label>
                <Select
                  options={recipeOptions}
                  onChange={(selectedOption) => handleRecipeSelection(selectedOption, day, meal)}
                  placeholder="Search and select a recipe"
                  onInputChange={handleSearch}
                  isSearchable={true}
                />

                {mealPlan[day][meal].map((recipeId) => (
                  <div key={recipeId} className="mt-4">
                    <RecipeCard recipe={getRecipeById(recipeId)} />
                    <button
                      onClick={() => handleRemoveRecipe(day, meal, recipeId)}
                      className="mt-2 text-red-500"
                    >
                      Remove Recipe
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;



