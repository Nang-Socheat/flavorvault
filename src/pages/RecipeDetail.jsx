import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipeById, isFavorite, toggleFavorite, deleteRecipe, recipes } = useApp();

  const recipe = getRecipeById(id);
  const isRecipeFavorite = isFavorite(id);
  
  // Cooking mode state
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Get source page for back button text
  const sourcePage = sessionStorage.getItem('recipeSourcePage') || 'recipes';
  const backButtonText = sourcePage === 'favorites' 
    ? 'Back to Favorites' 
    : sourcePage === 'meal-planner'
    ? 'Back to Meal Planner'
    : 'Back to Browse';

  // Find next and previous recipes based on source page
  // If from favorites, only navigate within favorite recipes
  const availableRecipes = sourcePage === 'favorites' 
    ? recipes.filter(r => isFavorite(r.id))
    : recipes;
  
  const currentIndex = availableRecipes.findIndex(r => r.id === id);
  const nextRecipe = currentIndex !== -1 && currentIndex < availableRecipes.length - 1 
    ? availableRecipes[currentIndex + 1] 
    : null;
  const prevRecipe = currentIndex > 0 
    ? availableRecipes[currentIndex - 1] 
    : null;

  // Swipe detection
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const MIN_SWIPE_DISTANCE = 50;

  const handleBack = () => {
    // Check where the user came from and navigate back accordingly
    const sourcePage = sessionStorage.getItem('recipeSourcePage');
    console.log('Navigating back, source page:', sourcePage);
    const savedId = sessionStorage.getItem('lastViewedRecipeId');
    console.log('Last viewed recipe ID in storage:', savedId);
    
    if (sourcePage === 'favorites') {
      navigate('/favorites');
    } else if (sourcePage === 'meal-planner') {
      navigate('/meal-planner');
    } else {
      navigate('/recipes');
    }
  };

  const handleNext = useCallback(() => {
    if (nextRecipe) {
      // Navigate to next recipe (will be saved when user clicks it)
      navigate(`/recipe/${nextRecipe.id}`);
      window.scrollTo(0, 0); // Scroll to top for the new recipe
    }
  }, [nextRecipe, navigate]);

  const handlePrevious = useCallback(() => {
    if (prevRecipe) {
      // Navigate to previous recipe (will be saved when user clicks it)
      navigate(`/recipe/${prevRecipe.id}`);
      window.scrollTo(0, 0); // Scroll to top for the new recipe
    }
  }, [prevRecipe, navigate]);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const swipeDistance = touchStartX.current - touchEndX.current;
      
      // Swipe left (next recipe)
      if (swipeDistance > MIN_SWIPE_DISTANCE && nextRecipe) {
        handleNext();
      }
      
      // Swipe right (previous recipe)
      if (swipeDistance < -MIN_SWIPE_DISTANCE && prevRecipe) {
        handlePrevious();
      }
    };

    // Only add listeners on mobile screens
    if (window.innerWidth < 768) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleNext, handlePrevious, nextRecipe, prevRecipe]);

  if (!recipe) {
    return (
      <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl mx-auto border-4 border-red-200">
          <div className="text-8xl mb-6">😕</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
          <p className="text-gray-600 text-lg mb-8">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/recipes"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Browse Recipes
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(id);
      navigate('/recipes');
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(id);
  };

  const handlePrint = () => {
     window.open(`/print/${recipe.id}`, '_blank');
  };

  // Cooking mode functions
  const toggleCookingMode = () => {
    setCookingMode(!cookingMode);
    setCurrentStep(0);
    if (!cookingMode) {
      // Scroll to instructions section when entering cooking mode
      setTimeout(() => {
        document.getElementById('cooking-mode-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const nextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
        {/* Navigation Buttons */}
        <div className="mb-6 flex justify-between items-center gap-4">
          <button
            onClick={handleBack}
            className="bg-white text-gray-700 px-4 sm:px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:bg-gray-50 border border-gray-200"
          >
            <span className="text-xl">←</span>
            <span className="hidden sm:inline">{backButtonText}</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          {/* Navigation buttons for desktop */}
          <div className="hidden md:flex items-center gap-3">
            {prevRecipe && (
              <button
                onClick={handlePrevious}
                className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:bg-gray-50 border border-gray-200"
              >
                <span className="text-xl">←</span>
                Previous
              </button>
            )}
            
            {nextRecipe && (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700"
              >
                Next
                <span className="text-xl">→</span>
              </button>
            )}
          </div>

          {/* Swipe hint for mobile - now clickable buttons */}
          <div className="md:hidden flex items-center gap-2">
            {prevRecipe && (
              <button
                onClick={handlePrevious}
                className="bg-white text-gray-700 px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-1 border border-gray-300"
              >
                <span className="text-lg">←</span>
                <span className="text-xs">Prev</span>
              </button>
            )}
            {nextRecipe && (
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-1"
              >
                <span className="text-xs">Next</span>
                <span className="text-lg">→</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Image Header */}
          <div className="relative h-72 sm:h-96 bg-gray-100 overflow-hidden">
            <img
              src={recipe.image || 'https://via.placeholder.com/1200x400?text=No+Image'}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.target.src !== 'https://via.placeholder.com/1200x400?text=No+Image') {
                  e.target.src = 'https://via.placeholder.com/1200x400?text=No+Image';
                } else {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"%3E%3Crect width="1200" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="24"%3ENo Image%3C/text%3E%3C/svg%3E';
                }
              }}
            />
            {/* Subtle gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-3 z-10">
              <button
                onClick={handlePrint}
                className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:scale-105 transition-all"
                title="Print Recipe"
              >
                <span className="text-2xl">🖨️</span>
              </button>
              <button
                onClick={handleToggleFavorite}
                className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:scale-105 transition-all"
              >
                <span className="text-2xl">
                  {isRecipeFavorite ? '❤️' : '🤍'}
                </span>
              </button>
            </div>
            
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/70 to-transparent">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                {recipe.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Description */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border-l-4 border-blue-600">
              <p className="text-gray-800 text-lg sm:text-xl font-medium leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
                <span className="text-lg">🍽️</span>
                {recipe.category}
              </span>
              <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white shadow-md ${
                recipe.difficulty === 'Easy' ? 'bg-green-600' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-600' :
                'bg-red-600'
              }`}>
                <span className="text-lg">📊</span>
                {recipe.difficulty}
              </span>
              {recipe.tags && recipe.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-300">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-md border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">⏱️</span>
                  <div className="text-sm font-semibold text-gray-600">Prep Time</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{recipe.prepTime} min</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🍳</span>
                  <div className="text-sm font-semibold text-gray-600">Cook Time</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{recipe.cookTime} min</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">👥</span>
                  <div className="text-sm font-semibold text-gray-600">Servings</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{recipe.servings}</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🕐</span>
                  <div className="text-sm font-semibold text-gray-600">Total Time</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{recipe.prepTime + recipe.cookTime} min</div>
              </div>
            </div>

            {/* Ingredients and Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Ingredients */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b-2 border-blue-200">
                    <span className="text-3xl">🛒</span>
                    Ingredients
                  </h2>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                        <span className="text-blue-600 font-bold text-lg flex-shrink-0">✓</span>
                        <span className="text-gray-800 font-medium leading-relaxed">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructions */}
              <div className="lg:col-span-2" id="cooking-mode-section">
                <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-200">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                      <span className="text-3xl">👨‍🍳</span>
                      Instructions
                    </h2>
                    {/* Cooking Mode Toggle */}
                    <button
                      onClick={toggleCookingMode}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${
                        cookingMode 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <span className="text-lg">{cookingMode ? '📖' : '🧑‍🍳'}</span>
                      <span className="hidden sm:inline">{cookingMode ? 'Exit Cooking Mode' : 'Cooking Mode'}</span>
                    </button>
                  </div>

                  {/* Regular Instructions View */}
                  {!cookingMode && (
                    <div className="space-y-5">
                      {recipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                            {index + 1}
                          </div>
                          <p className="text-gray-800 font-medium pt-1.5 leading-relaxed">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Cooking Mode View */}
                  {cookingMode && (
                    <div className="space-y-6">
                      {/* Progress Bar */}
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-green-600 h-full transition-all duration-300"
                          style={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
                        ></div>
                      </div>

                      {/* Current Step Display */}
                      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border-2 border-blue-300 shadow-lg min-h-[300px] flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                                {currentStep + 1}
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 font-semibold">Step {currentStep + 1} of {recipe.instructions.length}</p>
                                <div className="flex gap-1 mt-1">
                                  {recipe.instructions.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => goToStep(index)}
                                      className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentStep ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                                      }`}
                                      aria-label={`Go to step ${index + 1}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-900 text-xl sm:text-2xl font-medium leading-relaxed">
                            {recipe.instructions[currentStep]}
                          </p>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8 gap-4">
                          <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                              currentStep === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105'
                            }`}
                          >
                            <span className="text-xl">←</span>
                            <span className="hidden sm:inline">Previous</span>
                          </button>

                          {/* Show All Steps Button */}
                          <button
                            onClick={toggleCookingMode}
                            className="px-4 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
                            title="Show all steps"
                          >
                            <span className="text-xl">📋</span>
                          </button>

                          <button
                            onClick={nextStep}
                            disabled={currentStep === recipe.instructions.length - 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                              currentStep === recipe.instructions.length - 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:scale-105'
                            }`}
                          >
                            <span className="hidden sm:inline">Next</span>
                            <span className="text-xl">→</span>
                          </button>
                        </div>
                      </div>

                      {/* Step Overview (thumbnail view) */}
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-600 mb-3">All Steps:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {recipe.instructions.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => goToStep(index)}
                              className={`p-3 rounded-lg font-bold transition-all ${
                                index === currentStep
                                  ? 'bg-blue-600 text-white shadow-md scale-105'
                                  : index < currentStep
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {index + 1}
                              {index < currentStep && <span className="ml-1">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t-2 border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
              <Link
                to={`/edit/${recipe.id}`}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <span className="text-xl">✏️</span>
                Edit Recipe
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
              >
                <span className="text-xl">🗑️</span>
                Delete Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
