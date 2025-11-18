import express from 'express';
import Collection from '../models/Collection.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/collections
// @desc    Get user's collections
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id })
      .populate('recipes', 'title images prepTime cookTime difficulty')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      collections
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching collections'
    });
  }
});

// @route   GET /api/collections/:id
// @desc    Get single collection
// @access  Public (if public) / Private (if private)
router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate({
        path: 'recipes',
        populate: { path: 'author', select: 'name avatar' }
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check if collection is private
    if (!collection.isPublic &&
        (!req.user || collection.user._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'This collection is private'
      });
    }

    res.json({
      success: true,
      collection
    });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching collection'
    });
  }
});

// @route   POST /api/collections
// @desc    Create new collection
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, coverImage, isPublic, tags } = req.body;

    const collection = await Collection.create({
      user: req.user._id,
      name,
      description,
      coverImage,
      isPublic: isPublic || false,
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      collection
    });
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating collection'
    });
  }
});

// @route   PUT /api/collections/:id
// @desc    Update collection
// @access  Private (Owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    if (collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this collection'
      });
    }

    const { name, description, coverImage, isPublic, tags } = req.body;

    collection.name = name || collection.name;
    collection.description = description !== undefined ? description : collection.description;
    collection.coverImage = coverImage || collection.coverImage;
    collection.isPublic = isPublic !== undefined ? isPublic : collection.isPublic;
    collection.tags = tags || collection.tags;

    await collection.save();

    res.json({
      success: true,
      collection
    });
  } catch (error) {
    console.error('Update collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating collection'
    });
  }
});

// @route   DELETE /api/collections/:id
// @desc    Delete collection
// @access  Private (Owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    if (collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this collection'
      });
    }

    await Collection.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting collection'
    });
  }
});

// @route   POST /api/collections/:id/recipes/:recipeId
// @desc    Add recipe to collection
// @access  Private (Owner only)
router.post('/:id/recipes/:recipeId', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    if (collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this collection'
      });
    }

    if (collection.recipes.includes(req.params.recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already in collection'
      });
    }

    collection.recipes.push(req.params.recipeId);
    await collection.save();

    res.json({
      success: true,
      message: 'Recipe added to collection'
    });
  } catch (error) {
    console.error('Add recipe to collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding recipe to collection'
    });
  }
});

// @route   DELETE /api/collections/:id/recipes/:recipeId
// @desc    Remove recipe from collection
// @access  Private (Owner only)
router.delete('/:id/recipes/:recipeId', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    if (collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this collection'
      });
    }

    collection.recipes = collection.recipes.filter(
      id => id.toString() !== req.params.recipeId
    );
    await collection.save();

    res.json({
      success: true,
      message: 'Recipe removed from collection'
    });
  } catch (error) {
    console.error('Remove recipe from collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing recipe from collection'
    });
  }
});

export default router;
