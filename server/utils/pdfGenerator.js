import puppeteer from 'puppeteer';
import Recipe from '../models/Recipe.js';

// Generate PDF for a single recipe
export const generateRecipePDF = async (recipeId) => {
  try {
    const recipe = await Recipe.findById(recipeId).populate('author', 'name avatar');

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    const html = generateRecipeHTML(recipe);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error('Generate recipe PDF error:', error);
    throw error;
  }
};

// Generate PDF for recipe book (multiple recipes)
export const generateRecipeBookPDF = async (recipeIds, bookTitle = 'My Recipe Book', coverOptions = {}) => {
  try {
    const recipes = await Recipe.find({ _id: { $in: recipeIds } })
      .populate('author', 'name avatar');

    if (recipes.length === 0) {
      throw new Error('No recipes found');
    }

    const html = generateRecipeBookHTML(recipes, bookTitle, coverOptions);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error('Generate recipe book PDF error:', error);
    throw error;
  }
};

// Helper function to generate HTML for single recipe
function generateRecipeHTML(recipe) {
  const primaryImage = recipe.images?.find(img => img.isPrimary)?.url || recipe.images?.[0]?.url || '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3B82F6;
    }
    .recipe-title {
      font-size: 36px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .recipe-description {
      font-size: 16px;
      color: #666;
      font-style: italic;
    }
    .recipe-image {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      border-radius: 8px;
      margin: 20px 0;
    }
    .meta-info {
      display: flex;
      justify-content: space-around;
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .meta-item {
      text-align: center;
    }
    .meta-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #666;
    }
    .meta-value {
      font-size: 18px;
      font-weight: bold;
      color: #3B82F6;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
    }
    .ingredients-list {
      list-style: none;
      padding: 0;
    }
    .ingredient-item {
      padding: 8px 0;
      border-bottom: 1px dashed #e0e0e0;
    }
    .ingredient-quantity {
      font-weight: bold;
      color: #3B82F6;
      margin-right: 10px;
    }
    .instructions-list {
      counter-reset: step-counter;
      list-style: none;
      padding: 0;
    }
    .instruction-item {
      counter-increment: step-counter;
      margin-bottom: 20px;
      padding-left: 40px;
      position: relative;
    }
    .instruction-item::before {
      content: counter(step-counter);
      position: absolute;
      left: 0;
      top: 0;
      background: #3B82F6;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .nutrition {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }
    .nutrition-item {
      text-align: center;
    }
    .nutrition-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .nutrition-value {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="recipe-title">${recipe.title}</div>
    <div class="recipe-description">${recipe.description}</div>
  </div>

  ${primaryImage ? `<img src="${primaryImage}" class="recipe-image" alt="${recipe.title}" />` : ''}

  <div class="meta-info">
    <div class="meta-item">
      <div class="meta-label">Prep Time</div>
      <div class="meta-value">${recipe.prepTime} min</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Cook Time</div>
      <div class="meta-value">${recipe.cookTime} min</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Servings</div>
      <div class="meta-value">${recipe.servings}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Difficulty</div>
      <div class="meta-value">${recipe.difficulty}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Ingredients</div>
    <ul class="ingredients-list">
      ${recipe.ingredients.map(ing => `
        <li class="ingredient-item">
          <span class="ingredient-quantity">${ing.quantity} ${ing.unit}</span>
          ${ing.name}
          ${ing.notes ? `<em>(${ing.notes})</em>` : ''}
          ${ing.optional ? '<em>(optional)</em>' : ''}
        </li>
      `).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Instructions</div>
    <ol class="instructions-list">
      ${recipe.instructions.map(step => `
        <li class="instruction-item">${step.description}</li>
      `).join('')}
    </ol>
  </div>

  ${recipe.nutrition ? `
  <div class="section">
    <div class="section-title">Nutrition Information</div>
    <div class="nutrition">
      <div class="nutrition-item">
        <div class="nutrition-label">Calories</div>
        <div class="nutrition-value">${recipe.nutrition.calories || 'N/A'}</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-label">Protein</div>
        <div class="nutrition-value">${recipe.nutrition.protein || 'N/A'}g</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-label">Carbs</div>
        <div class="nutrition-value">${recipe.nutrition.carbohydrates || 'N/A'}g</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-label">Fat</div>
        <div class="nutrition-value">${recipe.nutrition.fat || 'N/A'}g</div>
      </div>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Recipe by ${recipe.author?.name || 'FlavorVault'}</p>
    <p>Generated by FlavorVault Recipe Book</p>
  </div>
</body>
</html>
  `;
}

// Helper function to generate HTML for recipe book
function generateRecipeBookHTML(recipes, bookTitle, coverOptions) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .cover-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      page-break-after: always;
    }
    .book-title {
      font-size: 60px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .book-subtitle {
      font-size: 24px;
      font-style: italic;
    }
    .recipe-page {
      page-break-before: always;
      padding: 40px;
    }
    .recipe-title {
      font-size: 32px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 3px solid #3B82F6;
    }
    .recipe-description {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
    }
    .meta-info {
      display: flex;
      gap: 20px;
      margin: 15px 0;
      font-size: 14px;
    }
    .meta-item {
      background: #f8f9fa;
      padding: 8px 15px;
      border-radius: 4px;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
      margin: 20px 0 10px 0;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 5px;
    }
    .ingredients-list, .instructions-list {
      padding-left: 20px;
      margin: 10px 0;
    }
    .ingredient-item, .instruction-item {
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover-page">
    <div class="book-title">${bookTitle}</div>
    <div class="book-subtitle">${recipes.length} Delicious Recipes</div>
    ${coverOptions.author ? `<p style="margin-top: 30px; font-size: 18px;">by ${coverOptions.author}</p>` : ''}
  </div>

  <!-- Table of Contents -->
  <div class="recipe-page">
    <h1 style="text-align: center; margin-bottom: 30px;">Table of Contents</h1>
    <ol style="font-size: 18px; line-height: 2;">
      ${recipes.map((recipe, index) => `
        <li>${recipe.title}</li>
      `).join('')}
    </ol>
  </div>

  <!-- Recipe Pages -->
  ${recipes.map(recipe => `
    <div class="recipe-page">
      <div class="recipe-title">${recipe.title}</div>
      <div class="recipe-description">${recipe.description}</div>

      <div class="meta-info">
        <div class="meta-item">⏱ Prep: ${recipe.prepTime} min</div>
        <div class="meta-item">🔥 Cook: ${recipe.cookTime} min</div>
        <div class="meta-item">🍽 Servings: ${recipe.servings}</div>
        <div class="meta-item">📊 ${recipe.difficulty}</div>
      </div>

      <div class="section-title">Ingredients</div>
      <ul class="ingredients-list">
        ${recipe.ingredients.map(ing => `
          <li class="ingredient-item">${ing.quantity} ${ing.unit} ${ing.name}</li>
        `).join('')}
      </ul>

      <div class="section-title">Instructions</div>
      <ol class="instructions-list">
        ${recipe.instructions.map(step => `
          <li class="instruction-item">${step.description}</li>
        `).join('')}
      </ol>

      ${recipe.nutrition ? `
        <div class="section-title">Nutrition (per serving)</div>
        <p>Calories: ${recipe.nutrition.calories} | Protein: ${recipe.nutrition.protein}g |
        Carbs: ${recipe.nutrition.carbohydrates}g | Fat: ${recipe.nutrition.fat}g</p>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>
  `;
}

export default {
  generateRecipePDF,
  generateRecipeBookPDF
};
