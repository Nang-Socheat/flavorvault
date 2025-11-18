import express from 'express';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's public recipes
    const recipes = await Recipe.find({
      author: req.params.id,
      isPublic: true,
      status: 'approved'
    }).limit(6);

    res.json({
      success: true,
      user,
      recipes
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'bio', 'avatar', 'skills', 'experience',
      'socialMedia', 'allergies', 'dietaryPreferences',
      'measurementUnit', 'measurementPreferences', 'themeColor', 'background'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   PUT /api/users/shop-info
// @desc    Update shop/restaurant information
// @access  Private
router.put('/shop-info', protect, async (req, res) => {
  try {
    if (!['shop', 'restaurant'].includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Only shops and restaurants can update shop info'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { shopInfo: req.body.shopInfo },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update shop info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shop information'
    });
  }
});

// @route   POST /api/users/favorites/:recipeId
// @desc    Add recipe to favorites
// @access  Private
router.post('/favorites/:recipeId', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const user = await User.findById(req.user._id);

    if (user.favorites.includes(req.params.recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already in favorites'
      });
    }

    user.favorites.push(req.params.recipeId);
    await user.save();

    // Update recipe favorites count
    recipe.favoritesCount += 1;
    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe added to favorites'
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites'
    });
  }
});

// @route   DELETE /api/users/favorites/:recipeId
// @desc    Remove recipe from favorites
// @access  Private
router.delete('/favorites/:recipeId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(req.params.recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe not in favorites'
      });
    }

    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.recipeId
    );
    await user.save();

    // Update recipe favorites count
    const recipe = await Recipe.findById(req.params.recipeId);
    if (recipe) {
      recipe.favoritesCount = Math.max(0, recipe.favoritesCount - 1);
      await recipe.save();
    }

    res.json({
      success: true,
      message: 'Recipe removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites'
    });
  }
});

// @route   GET /api/users/favorites
// @desc    Get user's favorite recipes
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: { path: 'author', select: 'name avatar' }
    });

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites'
    });
  }
});

export default router;
