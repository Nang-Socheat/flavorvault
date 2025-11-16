// Utility functions for localStorage data persistence

const STORAGE_KEYS = {
  RECIPES: 'flavorvault_recipes',
  FAVORITES: 'flavorvault_favorites',
  SETTINGS: 'flavorvault_settings',
};

// Generic localStorage functions
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const saveToLocalStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
    return false;
  }
};

// Recipe-specific functions
export const getRecipes = () => {
  return getFromLocalStorage(STORAGE_KEYS.RECIPES, []);
};

export const saveRecipes = (recipes) => {
  return saveToLocalStorage(STORAGE_KEYS.RECIPES, recipes);
};

export const addRecipe = (recipe) => {
  const recipes = getRecipes();
  const newRecipe = {
    ...recipe,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  recipes.push(newRecipe);
  saveRecipes(recipes);
  return newRecipe;
};

export const updateRecipe = (id, updatedRecipe) => {
  const recipes = getRecipes();
  const index = recipes.findIndex(recipe => recipe.id === id);
  if (index !== -1) {
    recipes[index] = {
      ...recipes[index],
      ...updatedRecipe,
      updatedAt: new Date().toISOString(),
    };
    saveRecipes(recipes);
    return recipes[index];
  }
  return null;
};

export const deleteRecipe = (id) => {
  const recipes = getRecipes();
  const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
  saveRecipes(filteredRecipes);
  return true;
};

// Favorites-specific functions
export const getFavorites = () => {
  return getFromLocalStorage(STORAGE_KEYS.FAVORITES, []);
};

export const saveFavorites = (favorites) => {
  return saveToLocalStorage(STORAGE_KEYS.FAVORITES, favorites);
};

export const toggleFavorite = (recipeId) => {
  const favorites = getFavorites();
  const index = favorites.indexOf(recipeId);

  if (index === -1) {
    favorites.push(recipeId);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites(favorites);
  return index === -1; // returns true if added, false if removed
};

export const isFavorite = (recipeId) => {
  const favorites = getFavorites();
  return favorites.includes(recipeId);
};

// Settings-specific functions
export const getSettings = () => {
  return getFromLocalStorage(STORAGE_KEYS.SETTINGS, {
    theme: 'light',
    recipesPerPage: 12,
  });
};

export const saveSettings = (settings) => {
  return saveToLocalStorage(STORAGE_KEYS.SETTINGS, settings);
};

export const updateSetting = (key, value) => {
  const settings = getSettings();
  settings[key] = value;
  saveSettings(settings);
  return settings;
};
