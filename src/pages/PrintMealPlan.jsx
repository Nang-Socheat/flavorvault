import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useEffect } from "react";

const PrintMealPlan = () => {
  const [searchParams] = useSearchParams();
  const { getRecipeById } = useApp();
  
  // Get meal plan data from URL params
  const mode = searchParams.get('mode') || 'day'; // 'day' or 'week'
  const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const mealPlanData = searchParams.get('data');

  const handlePrint = () => window.print();
  const handleClose = () => window.close();

  // Auto-print when component loads (optional - like PrintRecipe)
  useEffect(() => {
    if (mealPlanData) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mealPlanData]);

  if (!mealPlanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Meal Plan Data</h1>
          <p className="text-gray-600 mb-4">
            The meal plan data was not provided. Please try printing from the Meal Planner page again.
          </p>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Parse meal plan data with error handling
  let mealPlan;
  try {
    mealPlan = JSON.parse(decodeURIComponent(mealPlanData));
  } catch (error) {
    console.error('Error parsing meal plan data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Meal Plan</h1>
          <p className="text-gray-600 mb-4">
            There was an error loading the meal plan data. Please try again.
          </p>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
    { id: 'snack', label: 'Snack', icon: '🍎' },
    { id: 'special', label: 'Special', icon: '⭐' },
    { id: 'occasion', label: 'Occasion', icon: '🎉' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Render single day meal plan - only print meals that have content
  const renderDayPlan = () => {
    const dayData = mealPlan[dateStr] || {};
    
    // Filter out meal types with no meals
    const mealsWithContent = mealTypes.filter(mealType => {
      const meals = dayData[mealType.id] || [];
      return meals.length > 0;
    });
    
    if (mealsWithContent.length === 0) {
      return (
        <div className="max-w-5xl mx-auto p-6 print:p-3">
          <div className="text-center mb-4 print:mb-2">
            <div className="inline-block border-2 border-gray-800 px-6 py-2 rounded-lg print:px-4 print:py-1.5">
              <h1 className="text-2xl font-bold text-gray-900 print:text-lg">Meal Plan</h1>
              <p className="text-base mt-0.5 text-gray-700 print:text-xs">{formatDate(dateStr)}</p>
            </div>
          </div>
          <p className="text-center text-gray-600 italic">No meals planned for this day.</p>
        </div>
      );
    }
    
    return (
      <div className="max-w-5xl mx-auto p-6 print:p-4">
        {/* Header - Compact but readable */}
        <div className="text-center mb-4 print:mb-2">
          <h1 className="text-2xl font-bold text-gray-900 print:text-lg">Meal Plan</h1>
          <p className="text-base text-gray-700 print:text-sm">{formatDate(dateStr)}</p>
          <hr className="border-t-2 border-gray-800 mt-2 print:mt-1" />
        </div>

        {/* Meal Sections - Each meal type with all its recipes */}
        <div className="space-y-4 print:space-y-2">
          {mealsWithContent.map(mealType => {
            const meals = dayData[mealType.id] || [];
            
            return (
              <div key={mealType.id} className="print-meal-section">
                {/* Single border container for each meal type */}
                <div className="border-2 border-gray-800 rounded overflow-hidden">
                  {/* Meal Type Header - No emoji in print */}
                  <div className="bg-gray-100 border-b-2 border-gray-800 px-4 py-2 print:px-3 print:py-1">
                    <h2 className="text-xl font-bold text-gray-900 print:text-base">
                      <span className="print:hidden">{mealType.icon} </span>{mealType.label}
                    </h2>
                  </div>

                  {/* All Recipes for this meal type */}
                  <div className="p-4 print:p-2">
                    {meals.map((meal, index) => {
                      const recipe = getRecipeById(meal.recipeId);
                      if (!recipe) return null;

                      return (
                        <div key={meal.id} className={`print-recipe ${index > 0 ? 'mt-4 pt-4 border-t border-gray-400 print:mt-2 print:pt-2' : ''}`}>
                          {/* Recipe Header */}
                          <div className="mb-2 print:mb-1.5">
                            <h3 className="text-lg font-bold text-gray-900 print:text-sm">
                              {recipe.title}
                            </h3>
                            <div className="text-sm text-gray-700 mt-1 print:text-xs">
                              {recipe.category} • {recipe.difficulty} • {recipe.prepTime + recipe.cookTime} min • Portions: {meal.portions}
                            </div>
                          </div>

                          {/* Two Column Layout: Ingredients & Instructions - Always side-by-side */}
                          <div className="grid grid-cols-2 gap-4 print:gap-3">
                            {/* Ingredients */}
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 print:text-xs print:mb-1">Ingredients:</h4>
                              <ul className="space-y-1 print:space-y-0.5">
                                {recipe.ingredients.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm print:text-xs">
                                    <span className="font-bold">□</span>
                                    <span className="text-gray-800">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Instructions */}
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 print:text-xs print:mb-1">Instructions:</h4>
                              <ol className="space-y-1.5 print:space-y-0.5">
                                {recipe.instructions.map((step, idx) => (
                                  <li key={idx} className="flex gap-2 text-sm print:text-xs">
                                    <div className="flex-shrink-0 w-5 h-5 border-2 border-gray-800 rounded-full flex items-center justify-center font-bold text-xs print:w-4 print:h-4 print:text-[9px]">
                                      {idx + 1}
                                    </div>
                                    <p className="text-gray-800">{step}</p>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 mt-4 pt-2 border-t border-gray-400 print:text-[10px] print:mt-2 print:pt-1">
          FlavorVault · {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </div>
    );
  };

  // Render week meal plan - REMOVED (only daily printing needed)

  return (
    <div className="min-h-screen bg-white">
      {/* Top Action Bar */}
      <div className="print:hidden sticky top-0 bg-white shadow-md z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Print Preview</h1>
            <p className="text-sm text-gray-600">Daily Meal Plan</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">🖨️</span>
              Print
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Content - Only Daily View */}
      {renderDayPlan()}

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          
          body {
            color: black;
          }
          
          /* Force two-column layout in print */
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          /* Prevent recipes from splitting across pages */
          .print-recipe {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Keep entire meal section together (header + content) */
          .print-meal-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* If meal section doesn't fit, move to next page */
          .print-meal-section {
            page-break-before: auto;
          }
          
          /* Ensure borders don't split */
          .border-2.border-gray-800 {
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
          }
          
          /* Reasonable font sizes for print */
          h1 {
            font-size: 1.125rem !important;
            line-height: 1.4 !important;
          }
          
          h2 {
            font-size: 1rem !important;
            line-height: 1.4 !important;
          }
          
          h3 {
            font-size: 0.875rem !important;
            line-height: 1.4 !important;
          }
          
          h4 {
            font-size: 0.75rem !important;
            line-height: 1.4 !important;
          }
          
          p, li {
            font-size: 0.75rem !important;
            line-height: 1.5 !important;
          }
          
          /* Compact but readable spacing */
          .print\\:mb-2 {
            margin-bottom: 0.5rem !important;
          }
          
          .print\\:p-4 {
            padding: 0.5cm !important;
          }
          
          .print\\:space-y-2 > * + * {
            margin-top: 0.5rem !important;
          }
          
          .print\\:gap-3 {
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintMealPlan;
