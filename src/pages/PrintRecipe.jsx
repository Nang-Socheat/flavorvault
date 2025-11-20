import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

const PrintRecipe = () => {
  const { id } = useParams();
  const { getRecipeById } = useApp();
  const recipe = getRecipeById(id);

  const handlePrint = () => window.print();
  const handleClose = () => window.close();

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold">Recipe Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 print:p-4 max-w-4xl mx-auto">

      {/* Top Action Bar  */}
      <div className="print:hidden mb-4 flex justify-between">
        <h1 className="text-xl font-bold">Print Preview</h1>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded">
            Print
          </button>
          <button onClick={handleClose} className="px-4 py-2 bg-gray-600 text-white rounded">
            Close
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-semibold text-red-700 mb-4 text-center">
        {recipe.title}
      </h1>

      
      <div className="w-full border rounded p-4 mb-8">
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

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* INGREDIENTS */}
        <div>
          <h2 className="text-xl font-semibold text-red-700 mb-3 border-b pb-1">
            Ingredients & Prep
          </h2>

          <ul className="space-y-1 text-sm">
            {recipe.ingredients.map((item, index) => (
              <li key={index} className="flex">
                <span className="mr-2">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* METHOD */}
        <div>
          <h2 className="text-xl font-semibold text-red-700 mb-3 border-b pb-1">
            Method
          </h2>

          <ol className="space-y-3 text-sm">
            {recipe.instructions.map((step, index) => (
              <li key={index}>
                <strong>Step {index + 1} -</strong> {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-10 pt-4 border-t">
        Printed on {new Date().toLocaleDateString()}
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 1cm;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintRecipe;
