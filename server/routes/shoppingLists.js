import express from 'express';
import ShoppingList from '../models/ShoppingList.js';
import Recipe from '../models/Recipe.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/shopping-lists
// @desc    Get user's shopping lists
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find({ user: req.user._id })
      .populate('recipeItems.recipe', 'title images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      shoppingLists
    });
  } catch (error) {
    console.error('Get shopping lists error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shopping lists'
    });
  }
});

// @route   GET /api/shopping-lists/:id
// @desc    Get single shopping list
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('recipeItems.recipe consolidatedItems.recipes');

    if (!shoppingList) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    res.json({
      success: true,
      shoppingList
    });
  } catch (error) {
    console.error('Get shopping list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shopping list'
    });
  }
});

// @route   POST /api/shopping-lists
// @desc    Create shopping list
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.create({
      user: req.user._id,
      name: req.body.name || 'My Shopping List'
    });

    res.status(201).json({
      success: true,
      shoppingList
    });
  } catch (error) {
    console.error('Create shopping list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shopping list'
    });
  }
});

// @route   POST /api/shopping-lists/:id/from-recipes
// @desc    Generate shopping list from recipes
// @access  Private
router.post('/:id/from-recipes', protect, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    const { recipeIds } = req.body;

    // Get recipes
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });

    // Add ingredients from each recipe
    const recipeItems = [];
    const ingredientMap = new Map();

    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        recipeItems.push({
          recipe: recipe._id,
          ingredient: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        });

        // Consolidate ingredients
        const key = `${ingredient.name.toLowerCase()}-${ingredient.unit}`;
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key);
          existing.totalQuantity += ingredient.quantity;
          existing.recipes.push(recipe._id);
        } else {
          ingredientMap.set(key, {
            ingredient: ingredient.name,
            totalQuantity: ingredient.quantity,
            unit: ingredient.unit,
            recipes: [recipe._id]
          });
        }
      });
    });

    shoppingList.recipeItems = recipeItems;
    shoppingList.consolidatedItems = Array.from(ingredientMap.values());
    await shoppingList.save();

    res.json({
      success: true,
      shoppingList
    });
  } catch (error) {
    console.error('Generate shopping list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating shopping list'
    });
  }
});

// @route   POST /api/shopping-lists/:id/custom-items
// @desc    Add custom item to shopping list
// @access  Private
router.post('/:id/custom-items', protect, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    shoppingList.customItems.push(req.body);
    await shoppingList.save();

    res.json({
      success: true,
      shoppingList
    });
  } catch (error) {
    console.error('Add custom item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding custom item'
    });
  }
});

// @route   PATCH /api/shopping-lists/:id/items/:itemId/check
// @desc    Toggle item check status
// @access  Private
router.patch('/:id/items/:itemId/check', protect, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    // Find and toggle item in recipeItems, customItems, or consolidatedItems
    const itemId = req.params.itemId;
    let found = false;

    ['recipeItems', 'customItems', 'consolidatedItems'].forEach(itemType => {
      const item = shoppingList[itemType].id(itemId);
      if (item) {
        item.checked = !item.checked;
        found = true;
      }
    });

    if (!found) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await shoppingList.save();

    res.json({
      success: true,
      shoppingList
    });
  } catch (error) {
    console.error('Toggle item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling item'
    });
  }
});

// @route   DELETE /api/shopping-lists/:id
// @desc    Delete shopping list
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!shoppingList) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    res.json({
      success: true,
      message: 'Shopping list deleted successfully'
    });
  } catch (error) {
    console.error('Delete shopping list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shopping list'
    });
  }
});

export default router;
