import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getRecipes,
  saveRecipes,
  addRecipe as addRecipeToStorage,
  updateRecipe as updateRecipeInStorage,
  deleteRecipe as deleteRecipeFromStorage,
  getFavorites,
  toggleFavorite as toggleFavoriteInStorage,
  getSettings,
  saveSettings,
} from '../utils/localStorage';
import { sampleRecipes } from '../data/sampleRecipes';

const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [settings, setSettings] = useState({
    theme: 'light',
    recipesPerPage: 12,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from localStorage on mount (useEffect for side effects)
  useEffect(() => {
    const loadData = () => {
      try {
        let loadedRecipes = getRecipes();

        // If no recipes exist, load sample data
        if (!loadedRecipes || loadedRecipes.length === 0) {
          loadedRecipes = sampleRecipes;
          saveRecipes(loadedRecipes);
        }

        setRecipes(loadedRecipes);
        setFavorites(getFavorites());
        setSettings(getSettings());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Recipe management functions
  const addRecipe = (recipeData) => {
    const newRecipe = addRecipeToStorage(recipeData);
    setRecipes(prev => [...prev, newRecipe]);
    return newRecipe;
  };

  const updateRecipe = (id, recipeData) => {
    const updatedRecipe = updateRecipeInStorage(id, recipeData);
    if (updatedRecipe) {
      setRecipes(prev =>
        prev.map(recipe => (recipe.id === id ? updatedRecipe : recipe))
      );
    }
    return updatedRecipe;
  };

  const deleteRecipe = (id) => {
    deleteRecipeFromStorage(id);
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    // Also remove from favorites if it exists
    if (favorites.includes(id)) {
      toggleFavorite(id);
    }
  };

  const getRecipeById = (id) => {
    return recipes.find(recipe => recipe.id === id);
  };

  // Favorites management
  const toggleFavorite = (recipeId) => {
    const isAdded = toggleFavoriteInStorage(recipeId);
    setFavorites(prev =>
      isAdded
        ? [...prev, recipeId]
        : prev.filter(id => id !== recipeId)
    );
    return isAdded;
  };

  const isFavorite = (recipeId) => {
    return favorites.includes(recipeId);
  };

  const getFavoriteRecipes = () => {
    return recipes.filter(recipe => favorites.includes(recipe.id));
  };

  // Settings management
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  // Search and filter functions
  const searchRecipes = useCallback((query, filters = {}) => {
    let filtered = [...recipes];

    // Text search (title, description, ingredients)
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery)) ||
        recipe.category.toLowerCase().includes(lowerQuery) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(recipe =>
        recipe.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'all') {
      filtered = filtered.filter(recipe =>
        recipe.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }

    // Filter by ingredients (must include all selected ingredients)
    if (filters.ingredients && filters.ingredients.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.ingredients.every(filterIng =>
          recipe.ingredients.some(recipeIng =>
            recipeIng.toLowerCase().includes(filterIng.toLowerCase())
          )
        )
      );
    }

    if (filters.maxPrepTime) {
      filtered = filtered.filter(recipe => (recipe.prepTime + recipe.cookTime) <= filters.maxPrepTime);
    }

    return filtered;
  }, [recipes]);

  const saveMealPlan = (mealPlan) => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  };

  const getMealPlan = () => {
    const mealPlan = localStorage.getItem('mealPlan');
    return mealPlan ? JSON.parse(mealPlan) : null;
  };

  const value = {
    // State
    recipes,
    favorites,
    settings,
    isLoading,
    // Recipe functions
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    searchRecipes,
    // Favorites functions
    toggleFavorite,
    isFavorite,
    getFavoriteRecipes,
    // Settings functions
    updateSettings,
    // MealPlanner function
    saveMealPlan,
    getMealPlan,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
