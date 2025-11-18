import express from 'express';
import OpenAI from 'openai';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @route   POST /api/ai/suggest-ingredients
// @desc    Get AI ingredient pairing suggestions
// @access  Private
router.post('/suggest-ingredients', protect, async (req, res) => {
  try {
    const { ingredients } = req.body;

    const prompt = `You are a professional chef. Given these ingredients: ${ingredients.join(', ')}, suggest 5-10 additional ingredients that would pair well with them for a delicious recipe. Provide only the ingredient names, separated by commas.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });

    const suggestions = completion.choices[0].message.content
      .split(',')
      .map(s => s.trim());

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('AI suggest ingredients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting ingredient suggestions'
    });
  }
});

// @route   POST /api/ai/suggest-recipes
// @desc    Get AI recipe suggestions based on available ingredients, preferences, mood
// @access  Private
router.post('/suggest-recipes', protect, async (req, res) => {
  try {
    const { ingredients, preferences, mood, dietaryRestrictions } = req.body;
    const user = await User.findById(req.user._id);

    let prompt = `You are a professional chef. Based on the following:
- Available ingredients: ${ingredients?.join(', ') || 'any'}
- Taste preferences: ${preferences || 'any'}
- Mood/desire: ${mood || 'something delicious'}
- Dietary restrictions: ${dietaryRestrictions?.join(', ') || user.dietaryPreferences?.join(', ') || 'none'}
- Allergies to avoid: ${user.allergies?.join(', ') || 'none'}

Suggest 3 recipe ideas. For each, provide:
1. Recipe name
2. Brief description (1-2 sentences)
3. Why it matches the request
4. Difficulty level (Easy/Medium/Hard)

Format as JSON array with fields: name, description, reason, difficulty`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 800
    });

    const suggestions = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('AI suggest recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting recipe suggestions'
    });
  }
});

// @route   POST /api/ai/create-recipe
// @desc    AI Chef - Create unique recipe
// @access  Private
router.post('/create-recipe', protect, async (req, res) => {
  try {
    const { theme, cuisineType, dietaryPreferences, servings } = req.body;

    const prompt = `You are an innovative chef creating original recipes. Create a unique and delicious recipe with:
- Theme/concept: ${theme || 'creative fusion'}
- Cuisine type: ${cuisineType || 'any'}
- Dietary: ${dietaryPreferences?.join(', ') || 'none'}
- Servings: ${servings || 4}

Provide a complete recipe in JSON format with:
{
  "title": "Recipe name",
  "description": "Brief description",
  "prepTime": minutes,
  "cookTime": minutes,
  "servings": number,
  "difficulty": "Easy/Medium/Hard",
  "ingredients": [{"name": "", "quantity": number, "unit": ""}],
  "instructions": [{"stepNumber": 1, "description": ""}],
  "tags": []
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 1500
    });

    const recipe = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error('AI create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating recipe'
    });
  }
});

// @route   POST /api/ai/scan-receipt
// @desc    Scan receipt/handwritten note and convert to recipe
// @access  Private
router.post('/scan-receipt', protect, async (req, res) => {
  try {
    const { imageUrl, text } = req.body;

    let prompt = `Convert this recipe information into a structured format. `;

    if (text) {
      prompt += `Text: ${text}`;
    } else {
      prompt += `Analyze the image and extract recipe information.`;
    }

    prompt += `

Provide the recipe in JSON format:
{
  "title": "",
  "description": "",
  "ingredients": [{"name": "", "quantity": number, "unit": ""}],
  "instructions": [{"stepNumber": 1, "description": ""}],
  "prepTime": minutes (estimate if not provided),
  "cookTime": minutes (estimate if not provided),
  "servings": number (estimate if not provided)
}`;

    const messages = [{ role: "user", content: prompt }];

    // If image URL provided, use vision model
    const completion = await openai.chat.completions.create({
      model: imageUrl ? "gpt-4-vision-preview" : "gpt-4",
      messages: imageUrl ? [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      }] : messages,
      max_tokens: 1500
    });

    const recipe = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error('AI scan receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scanning receipt'
    });
  }
});

// @route   POST /api/ai/recognize-food
// @desc    Recognize food from image and find similar recipes
// @access  Private
router.post('/recognize-food', protect, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const prompt = `Analyze this food image and identify:
1. What dish/food is this?
2. Main ingredients visible
3. Estimated cuisine type
4. Any special characteristics

Provide in JSON format:
{
  "dishName": "",
  "ingredients": [],
  "cuisineType": "",
  "description": ""
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      }],
      max_tokens: 500
    });

    const recognition = JSON.parse(completion.choices[0].message.content);

    // Find similar recipes in database
    const similarRecipes = await Recipe.find({
      $or: [
        { title: { $regex: recognition.dishName, $options: 'i' } },
        { cuisineType: recognition.cuisineType },
        { tags: { $in: recognition.ingredients } }
      ],
      isPublic: true,
      status: 'approved'
    })
      .populate('author', 'name avatar')
      .limit(5);

    res.json({
      success: true,
      recognition,
      similarRecipes
    });
  } catch (error) {
    console.error('AI recognize food error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recognizing food'
    });
  }
});

// @route   POST /api/ai/check-toxic-ingredients
// @desc    Check for toxic ingredient combinations
// @access  Public
router.post('/check-toxic-ingredients', async (req, res) => {
  try {
    const { ingredients } = req.body;

    const prompt = `As a food safety expert, analyze these ingredients for any dangerous or toxic combinations: ${ingredients.join(', ')}

Check for:
1. Chemical reactions that could be harmful
2. Known dangerous food combinations
3. Allergen conflicts
4. Food safety concerns

Respond in JSON:
{
  "isSafe": boolean,
  "warnings": ["list of warnings if any"],
  "recommendations": ["safety recommendations"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Lower temperature for more factual responses
      max_tokens: 500
    });

    const safetyCheck = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      safetyCheck
    });
  } catch (error) {
    console.error('Check toxic ingredients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking ingredients'
    });
  }
});

// @route   POST /api/ai/detect-allergens
// @desc    Detect allergens in recipe based on user allergies
// @access  Private
router.post('/detect-allergens', protect, async (req, res) => {
  try {
    const { ingredients } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.allergies || user.allergies.length === 0) {
      return res.json({
        success: true,
        alerts: [],
        message: 'No allergies configured in user profile'
      });
    }

    const prompt = `Given these user allergies: ${user.allergies.join(', ')}

Analyze these ingredients: ${ingredients.join(', ')}

Identify any ingredients that might trigger the allergies. Consider:
- Direct allergens
- Hidden allergens
- Cross-contamination risks

Respond in JSON:
{
  "hasAllergens": boolean,
  "alerts": [
    {
      "ingredient": "",
      "allergen": "",
      "severity": "high/medium/low",
      "reason": ""
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 600
    });

    const allergenDetection = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      ...allergenDetection
    });
  } catch (error) {
    console.error('Detect allergens error:', error);
    res.status(500).json({
      success: false,
      message: 'Error detecting allergens'
    });
  }
});

export default router;
