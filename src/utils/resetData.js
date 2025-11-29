// Utility to reset data to sample recipes
import { sampleRecipes } from '../data/sampleRecipes';

export const resetToSampleData = () => {
  try {
    // Clear all recipe-related data
    localStorage.removeItem('flavorvault_recipes');
    localStorage.removeItem('flavorvault_favorites');
    localStorage.removeItem('flavorvault_mealPlan');

    // Save fresh sample recipes
    localStorage.setItem('flavorvault_recipes', JSON.stringify(sampleRecipes));

    console.log(`✅ Reset complete! Loaded ${sampleRecipes.length} sample recipes.`);

    // Reload the page to see changes
    window.location.reload();
  } catch (error) {
    console.error('❌ Error resetting data:', error);
  }
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  window.resetToSampleData = resetToSampleData;
}
