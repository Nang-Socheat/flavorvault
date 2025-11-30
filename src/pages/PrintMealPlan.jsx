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
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'from-orange-400 to-yellow-300' },
    { id: 'lunch', label: 'Lunch', icon: '☀️', color: 'from-blue-400 to-cyan-300' },
    { id: 'dinner', label: 'Dinner', icon: '🌙', color: 'from-purple-400 to-indigo-400' },
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

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Render single day meal plan
  const renderDayPlan = () => {
    const dayData = mealPlan[dateStr] || {};
    
    return (
      <div className="max-w-5xl mx-auto p-6 print:p-3 print:max-h-screen">
        {/* Header */}
        <div className="text-center mb-4 print:mb-2">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-xl shadow-lg print:px-4 print:py-1.5">
            <h1 className="text-2xl font-bold print:text-lg">🍽️ Meal Plan</h1>
            <p className="text-base mt-0.5 print:text-xs">{formatDate(dateStr)}</p>
          </div>
        </div>

        {/* Meal Sections - Compact for printing */}
        <div className="space-y-3 print:space-y-2">
          {mealTypes.map(mealType => {
            const meals = dayData[mealType.id] || [];
            
            return (
              <div key={mealType.id} className="border border-gray-300 rounded-lg overflow-hidden print:break-inside-avoid">
                {/* Meal Type Header - Compact */}
                <div className={`bg-gradient-to-r ${mealType.color} text-white px-3 py-1.5 print:px-2 print:py-1`}>
                  <h2 className="text-lg font-bold flex items-center gap-1.5 print:text-sm">
                    <span className="text-base print:text-sm">{mealType.icon}</span>
                    <span>{mealType.label}</span>
                  </h2>
                </div>

                {/* Recipes - Compact */}
                <div className="bg-white p-2 print:p-1.5">
                  {meals.length > 0 ? (
                    <div className="space-y-2 print:space-y-1.5">
                      {meals.map((meal, index) => {
                        const recipe = getRecipeById(meal.recipeId);
                        if (!recipe) return null;

                        return (
                          <div key={meal.id} className="border border-gray-200 rounded p-2 print:p-1.5">
                            <div className="flex gap-2">
                              {/* Recipe Image - Smaller */}
                              {recipe.image && (
                                <div className="w-16 h-16 print:w-12 print:h-12 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}

                              {/* Recipe Info - Compact */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 mb-0.5 print:text-xs leading-tight">
                                  {recipe.title}
                                </h3>
                                <div className="text-xs text-gray-600 print:text-[9px] leading-snug">
                                  <p>
                                    {recipe.category} • {recipe.difficulty} • {recipe.prepTime + recipe.cookTime}min • Portions: {meal.portions}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-2 italic print:py-1 print:text-xs">
                      No {mealType.label.toLowerCase()} planned
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer - Compact */}
        <div className="text-center text-xs text-gray-500 mt-3 pt-2 border-t print:text-[9px] print:mt-2 print:pt-1">
          Printed from FlavorVault • {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </div>
    );
  };

  // Render week meal plan
  const renderWeekPlan = () => {
    const dates = Object.keys(mealPlan).sort();
    const weekStart = dates.length > 0 ? getShortDate(dates[0]) : '';
    const weekEnd = dates.length > 0 ? getShortDate(dates[dates.length - 1]) : '';
    
    return (
      <div className="max-w-6xl mx-auto p-4 print:p-2">
        {/* Header - Compact */}
        <div className="text-center mb-3 print:mb-2">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-xl shadow-lg print:px-4 print:py-1">
            <h1 className="text-xl font-bold print:text-base">🍽️ Weekly Meal Plan</h1>
            <p className="text-sm mt-0.5 print:text-xs">{weekStart} - {weekEnd}</p>
          </div>
        </div>

        {/* Days - Compact Grid */}
        <div className="space-y-2 print:space-y-1.5">
          {dates.map((date, dayIndex) => {
            const dayData = mealPlan[date] || {};
            const today = new Date().toISOString().split('T')[0];
            const isToday = date === today;

            return (
              <div 
                key={date} 
                className={`border rounded-lg overflow-hidden print:break-inside-avoid ${
                  isToday ? 'border-green-500 bg-green-50/50' : 'border-gray-300'
                }`}
              >
                {/* Day Header - Compact */}
                <div className={`px-3 py-1 print:px-2 print:py-0.5 ${
                  isToday 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                    : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800'
                }`}>
                  <h2 className="text-sm font-bold print:text-xs flex items-center gap-2">
                    {getDayName(date)} - {getShortDate(date)}
                    {isToday && <span className="text-xs font-normal bg-white/30 px-1.5 py-0.5 rounded print:text-[9px]">(Today)</span>}
                  </h2>
                </div>

                {/* Meals - Compact 3-column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 p-1.5 bg-white print:gap-1 print:p-1">
                  {mealTypes.map(mealType => {
                    const meals = dayData[mealType.id] || [];

                    return (
                      <div key={mealType.id} className="border border-gray-200 rounded overflow-hidden">
                        {/* Meal Type - Compact */}
                        <div className={`bg-gradient-to-r ${mealType.color} text-white px-2 py-0.5 print:px-1.5 print:py-0.5`}>
                          <h3 className="text-xs font-bold flex items-center gap-0.5 print:text-[9px]">
                            <span className="text-xs print:text-[9px]">{mealType.icon}</span>
                            <span>{mealType.label}</span>
                          </h3>
                        </div>

                        {/* Recipes - Very Compact */}
                        <div className="p-1 print:p-0.5">
                          {meals.length > 0 ? (
                            <div className="space-y-1 print:space-y-0.5">
                              {meals.map(meal => {
                                const recipe = getRecipeById(meal.recipeId);
                                if (!recipe) return null;

                                return (
                                  <div key={meal.id} className="text-[10px] border-b border-gray-100 pb-0.5 last:border-0 print:text-[8px] print:pb-0.5">
                                    <p className="font-bold text-gray-900 leading-tight">{recipe.title}</p>
                                    <p className="text-gray-600 leading-tight">
                                      {recipe.prepTime + recipe.cookTime}m • {meal.portions}p
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-[9px] text-gray-400 italic text-center py-1 print:text-[8px] print:py-0.5">
                              No meals
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer - Compact */}
        <div className="text-center text-[10px] text-gray-500 mt-2 pt-1 border-t print:text-[8px] print:mt-1.5 print:pt-0.5">
          FlavorVault • {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Action Bar */}
      <div className="print:hidden sticky top-0 bg-white shadow-md z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Print Preview</h1>
            <p className="text-sm text-gray-600">
              {mode === 'day' ? 'Daily' : 'Weekly'} Meal Plan
            </p>
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

      {/* Content */}
      {mode === 'day' ? renderDayPlan() : renderWeekPlan()}

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print\\:break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          
          /* Force compact printing */
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
          
          /* Tighter spacing for print */
          .space-y-3 > * + * {
            margin-top: 0.5rem !important;
          }
          
          .space-y-2 > * + * {
            margin-top: 0.25rem !important;
          }
        }
        
        @media screen {
          /* Preview styles remain normal */
        }
      `}</style>
    </div>
  );
};

export default PrintMealPlan;
