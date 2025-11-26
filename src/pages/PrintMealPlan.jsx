import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

const PrintMealPlan = () => {
  const { day } = useParams();
  const { getMealPlan, getRecipeById } = useApp();

  const mealPlan = getMealPlan();
  const dayPlan = mealPlan ? mealPlan[day] : null;

  useEffect(() => {
    // Auto-print when component loads
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    window.close();
  };

  if (!dayPlan) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Meal Plan Not Found</h1>
          <p className="text-gray-600">No meal plan found for {day}.</p>
        </div>
      </div>
    );
  }

  const meals = [
    { 
      key: 'breakfast', 
      label: 'Breakfast', 
      recipes: dayPlan.breakfast.map(id => getRecipeById(id)).filter(Boolean) 
    },
    { 
      key: 'lunch', 
      label: 'Lunch', 
      recipes: dayPlan.lunch.map(id => getRecipeById(id)).filter(Boolean) 
    },
    { 
      key: 'dinner', 
      label: 'Dinner', 
      recipes: dayPlan.dinner.map(id => getRecipeById(id)).filter(Boolean) 
    },
  ];

  const hasMeals = meals.some(meal => meal.recipes.length > 0);

  return (
    <div className="min-h-screen bg-white p-6 print:p-4 max-w-4xl mx-auto">
      {/* Top Action Bar */}
      <div className="print:hidden mb-4 flex justify-between">
        <h1 className="text-xl font-bold">Print Preview - {day}'s Meal Plan</h1>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint} 
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Print
          </button>
          <button 
            onClick={handleClose} 
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>

      {/* Main Header */}
      <h1 className="text-3xl font-bold mb-4 text-center">
        {day} Meal Plan
      </h1>

      {hasMeals ? (
        <div className="space-y-8">
          {meals.map((meal) => (
            meal.recipes.length > 0 && (
              <div key={meal.key} className="print:break-inside-avoid">
                {/* Meal Header */}
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                  {meal.label}
                </h2>

                {/* Recipes */}
                <div className="space-y-6">
                  {meal.recipes.map((recipe) => (
                    <div key={recipe.id} className="border rounded p-4 print:break-inside-avoid">
                      {/* Recipe Header */}
                      <h3 className="text-xl font-bold mb-2">
                        {recipe.title}
                      </h3>
                      
                      {/* Recipe Description */}
                      {recipe.description && (
                        <p className="text-gray-600 italic mb-4">
                          {recipe.description}
                        </p>
                      )}

                      {/* Quick Info - Similar to PrintRecipe style */}
                      <div className="w-full border rounded p-4 mb-4">
                        <div className="flex flex-wrap justify-between text-sm font-medium text-gray-700">
                          <div className="mb-2">
                            <strong>Category:</strong> {recipe.category}
                          </div>
                          <div className="mb-2">
                            <strong>Difficulty:</strong> {recipe.difficulty}
                          </div>
                          <div className="mb-2">
                            <strong>Prep:</strong> {recipe.prepTime} min
                          </div>
                          <div className="mb-2">
                            <strong>Cook:</strong> {recipe.cookTime} min
                          </div>
                          <div className="mb-2">
                            <strong>Total:</strong> {recipe.prepTime + recipe.cookTime} min
                          </div>
                          <div className="mb-2">
                            <strong>Servings:</strong> {recipe.servings}
                          </div>
                        </div>
                      </div>

                      {/* Ingredients and Instructions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Ingredients */}
                        <div>
                          <h4 className="text-lg font-bold mb-3 border-b pb-1">
                            Ingredients
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {recipe.ingredients.map((item, index) => (
                              <li key={index} className="flex">
                                <span className="mr-2">•</span> {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Instructions */}
                        <div>
                          <h4 className="text-lg font-bold mb-3 border-b pb-1">
                            Instructions
                          </h4>
                          <ol className="space-y-2 text-sm">
                            {recipe.instructions.map((step, index) => (
                              <li key={index}>
                                <strong>Step {index + 1} -</strong> {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* Tags */}
                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="mt-4 pt-3 border-t">
                          <div className="flex flex-wrap gap-1">
                            {recipe.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Meals Planned</h3>
          <p className="text-gray-600">
            No recipes have been assigned to {day}.
          </p>
        </div>
      )}

      

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
        Printed from FlavorVault • {new Date().toLocaleDateString()} • {day}'s Meal Plan
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 1cm;
            }
            .print\\:break-inside-avoid {
              break-inside: avoid;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintMealPlan;