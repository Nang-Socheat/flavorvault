import express from 'express';
import MealPlan from '../models/MealPlan.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/meal-plans
// @desc    Get user's meal plans
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user._id })
      .populate('meals.recipe', 'title images prepTime cookTime nutrition')
      .sort({ startDate: -1 });

    res.json({
      success: true,
      mealPlans
    });
  } catch (error) {
    console.error('Get meal plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meal plans'
    });
  }
});

// @route   GET /api/meal-plans/:id
// @desc    Get single meal plan
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('meals.recipe');

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      mealPlan
    });
  } catch (error) {
    console.error('Get meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meal plan'
    });
  }
});

// @route   POST /api/meal-plans
// @desc    Create meal plan
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const mealPlan = await MealPlan.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      mealPlan
    });
  } catch (error) {
    console.error('Create meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating meal plan'
    });
  }
});

// @route   PUT /api/meal-plans/:id
// @desc    Update meal plan
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    Object.assign(mealPlan, req.body);
    await mealPlan.save();

    res.json({
      success: true,
      mealPlan
    });
  } catch (error) {
    console.error('Update meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating meal plan'
    });
  }
});

// @route   DELETE /api/meal-plans/:id
// @desc    Delete meal plan
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting meal plan'
    });
  }
});

// @route   POST /api/meal-plans/:id/meals
// @desc    Add meal to meal plan
// @access  Private
router.post('/:id/meals', protect, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    mealPlan.meals.push(req.body);
    await mealPlan.save();

    res.json({
      success: true,
      mealPlan
    });
  } catch (error) {
    console.error('Add meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding meal'
    });
  }
});

// @route   DELETE /api/meal-plans/:id/meals/:mealId
// @desc    Remove meal from meal plan
// @access  Private
router.delete('/:id/meals/:mealId', protect, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    mealPlan.meals = mealPlan.meals.filter(
      meal => meal._id.toString() !== req.params.mealId
    );
    await mealPlan.save();

    res.json({
      success: true,
      mealPlan
    });
  } catch (error) {
    console.error('Remove meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing meal'
    });
  }
});

export default router;
