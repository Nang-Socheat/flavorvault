// Database of known toxic ingredient combinations
// This is a basic implementation - in production, this should use AI or a more comprehensive database

export const toxicCombinations = [
  {
    ingredients: ['milk', 'fish'],
    warning: 'Milk and fish together can cause digestive issues in some people',
    severity: 'low'
  },
  {
    ingredients: ['honey', 'ghee'],
    warning: 'Equal quantities of honey and ghee heated together can be harmful according to Ayurveda',
    severity: 'medium'
  },
  {
    ingredients: ['banana', 'milk'],
    warning: 'This combination may cause heaviness and is considered incompatible in Ayurveda',
    severity: 'low'
  },
  {
    ingredients: ['citrus', 'milk'],
    warning: 'Citrus fruits can curdle milk and cause digestive discomfort',
    severity: 'low'
  },
  {
    ingredients: ['alcohol', 'energy drinks'],
    warning: 'This combination can mask intoxication and lead to dangerous overconsumption',
    severity: 'high'
  }
];

// Check for toxic combinations in a list of ingredients
export const checkToxicCombinations = (ingredients) => {
  const warnings = [];
  const ingredientNames = ingredients.map(ing =>
    typeof ing === 'string' ? ing.toLowerCase() : ing.name.toLowerCase()
  );

  toxicCombinations.forEach(combo => {
    const foundIngredients = combo.ingredients.filter(toxicIng =>
      ingredientNames.some(recipeIng =>
        recipeIng.includes(toxicIng) || toxicIng.includes(recipeIng)
      )
    );

    if (foundIngredients.length === combo.ingredients.length) {
      warnings.push({
        combination: combo.ingredients.join(' + '),
        warning: combo.warning,
        severity: combo.severity
      });
    }
  });

  return {
    hasToxicCombination: warnings.length > 0,
    warnings
  };
};

// Common allergens database
export const commonAllergens = {
  'dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'ghee', 'whey', 'casein'],
  'eggs': ['egg', 'eggs', 'mayonnaise'],
  'fish': ['fish', 'salmon', 'tuna', 'cod', 'halibut', 'anchovy'],
  'shellfish': ['shrimp', 'crab', 'lobster', 'clam', 'mussel', 'oyster', 'scallop'],
  'tree-nuts': ['almond', 'walnut', 'cashew', 'pistachio', 'pecan', 'macadamia', 'hazelnut'],
  'peanuts': ['peanut', 'peanut butter'],
  'wheat': ['wheat', 'flour', 'bread', 'pasta', 'couscous'],
  'soy': ['soy', 'tofu', 'soy sauce', 'edamame', 'miso', 'tempeh'],
  'sesame': ['sesame', 'tahini'],
  'gluten': ['wheat', 'barley', 'rye', 'flour', 'bread']
};

// Detect allergens in ingredients
export const detectAllergens = (ingredients, userAllergies) => {
  const alerts = [];

  if (!userAllergies || userAllergies.length === 0) {
    return { hasAllergens: false, alerts: [] };
  }

  const ingredientNames = ingredients.map(ing =>
    typeof ing === 'string' ? ing.toLowerCase() : ing.name.toLowerCase()
  );

  userAllergies.forEach(allergy => {
    const allergenKeywords = commonAllergens[allergy] || [allergy];

    ingredientNames.forEach((ingredient, index) => {
      allergenKeywords.forEach(keyword => {
        if (ingredient.includes(keyword) || keyword.includes(ingredient)) {
          alerts.push({
            ingredient: typeof ingredients[index] === 'string' ? ingredients[index] : ingredients[index].name,
            allergen: allergy,
            severity: 'high',
            reason: `Contains ${allergy} which you are allergic to`
          });
        }
      });
    });
  });

  return {
    hasAllergens: alerts.length > 0,
    alerts
  };
};

export default {
  toxicCombinations,
  checkToxicCombinations,
  commonAllergens,
  detectAllergens
};
