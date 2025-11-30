import { useParams, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

const PrintRecipe = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { getRecipeById, recipes } = useApp();
  
  // Get multiple recipe IDs from URL query params
  const recipeIds = searchParams.get('ids')?.split(',') || [id];
  const recipesToPrint = recipeIds.map(recipeId => getRecipeById(recipeId)).filter(Boolean);

  const handlePrint = () => window.print();
  const handleClose = () => window.close();

  if (recipesToPrint.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h1>
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

  return (
    <div className="min-h-screen bg-white">
      {/* Top Action Bar */}
      <div className="print:hidden sticky top-0 bg-white shadow-md z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Print Preview</h1>
            <p className="text-sm text-gray-600">{recipesToPrint.length} recipe{recipesToPrint.length > 1 ? 's' : ''} selected</p>
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

      {/* Print Recipes */}
      {recipesToPrint.map((recipe, recipeIndex) => (
        <div key={recipe.id} className={recipeIndex < recipesToPrint.length - 1 ? "page-break" : ""}>
          <div className="max-w-5xl mx-auto p-8 print:p-4">
            {/* Compact Header with Image */}
            <div className="mb-4 print:mb-3">
              <div className="relative h-48 rounded-lg overflow-hidden mb-4 print:h-32 print:mb-2">
                <img
                  src={recipe.image || 'https://via.placeholder.com/800x300?text=Recipe+Image'}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x300?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 print:p-2">
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg print:text-2xl">
                    {recipe.title}
                  </h1>
                </div>
              </div>

              {/* Compact Description */}
              {recipe.description && (
                <p className="text-gray-700 text-sm mb-3 italic print:text-xs print:mb-2">
                  {recipe.description}
                </p>
              )}

              {/* Compact Recipe Info Cards */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3 print:gap-1 print:mb-2">
                <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center print:p-1">
                  <div className="text-xs text-gray-600 font-semibold">Category</div>
                  <div className="text-xs font-bold text-gray-900 print:text-[10px]">
                    {recipe.category}
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center print:p-1">
                  <div className="text-xs text-gray-600 font-semibold">Difficulty</div>
                  <div className="text-xs font-bold text-gray-900 print:text-[10px]">
                    {recipe.difficulty}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2 text-center print:p-1">
                  <div className="text-xs text-gray-600 font-semibold">Prep</div>
                  <div className="text-xs font-bold text-gray-900 print:text-[10px]">
                    {recipe.prepTime}m
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded p-2 text-center print:p-1">
                  <div className="text-xs text-gray-600 font-semibold">Cook</div>
                  <div className="text-xs font-bold text-gray-900 print:text-[10px]">
                    {recipe.cookTime}m
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded p-2 text-center print:p-1">
                  <div className="text-xs text-gray-600 font-semibold">Total</div>
                  <div className="text-xs font-bold text-gray-900 print:text-[10px]">
                    {recipe.prepTime + recipe.cookTime}m
                  </div>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded p-2 text-center print:p-1">
                  <div className="text-xs text-gray-600 font-semibold">Servings</div>
                  <div className="text-xs font-bold text-gray-900 print:text-[10px]">
                    {recipe.servings}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-3">
              {/* Compact Ingredients Section */}
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 print:p-2">
                <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-gray-900 border-b border-amber-300 pb-2 print:text-base print:mb-1 print:pb-1">
                  <span className="text-lg print:text-base">🛒</span>
                  Ingredients
                </h2>
                <ul className="space-y-1 print:space-y-0.5">
                  {recipe.ingredients.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-800 text-sm print:text-xs">
                      <span className="text-amber-600 font-bold flex-shrink-0 print:text-[10px]">✓</span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compact Instructions Section */}
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 print:p-2">
                <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-gray-900 border-b border-blue-300 pb-2 print:text-base print:mb-1 print:pb-1">
                  <span className="text-lg print:text-base">👨‍🍳</span>
                  Instructions
                </h2>
                <ol className="space-y-2 print:space-y-1">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex gap-2 text-sm print:text-xs">
                      <div className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs print:w-4 print:h-4 print:text-[10px]">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Compact Tags Section */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-3 print:mt-2">
                <div className="flex flex-wrap gap-1">
                  {recipe.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium print:text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compact Footer */}
            <div className="mt-3 pt-2 border-t border-gray-300 text-center print:mt-2 print:pt-1">
              <p className="text-xs text-gray-600 font-medium print:text-[10px]">
                FlavorVault · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {recipesToPrint.length > 1 && ` · Recipe ${recipeIndex + 1} of ${recipesToPrint.length}`}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Print Styles */}
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 0.8cm;
            }
            
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            .page-break {
              page-break-after: always;
              break-after: page;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            img {
              max-height: 120px;
              object-fit: cover;
            }
            
            /* Ensure content fits on one page */
            * {
              page-break-inside: avoid;
            }
            
            h1, h2, h3 {
              page-break-after: avoid;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintRecipe;
