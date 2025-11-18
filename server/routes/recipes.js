import express from 'express';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { protect, isRecipeOwner, authorize } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import { generateRecipePDF, generateRecipeBookPDF } from '../utils/pdfGenerator.js';

const router = express.Router();

// @route   GET /api/recipes
// @desc    Get all approved public recipes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      subCategory,
      occasion,
      cuisineType,
      difficulty,
      maxPrepTime,
      dietaryPreference,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {
      isPublic: true,
      status: 'approved'
    };

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = category;
    if (subCategory) query.subCategory = { $in: [subCategory] };
    if (occasion) query.occasion = { $in: [occasion] };
    if (cuisineType) query.cuisineType = cuisineType;
    if (difficulty) query.difficulty = difficulty;
    if (maxPrepTime) query.prepTime = { $lte: parseInt(maxPrepTime) };

    // Dietary preferences filter
    if (dietaryPreference) {
      query.subCategory = { $in: [dietaryPreference] };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const recipes = await Recipe.find(query)
      .populate('author', 'name avatar userType')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Recipe.countDocuments(query);

    res.json({
      success: true,
      recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes'
    });
  }
});

// @route   GET /api/recipes/trending
// @desc    Get trending recipes
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get recipes sorted by likes and views in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recipes = await Recipe.find({
      isPublic: true,
      status: 'approved',
      createdAt: { $gte: thirtyDaysAgo }
    })
      .populate('author', 'name avatar')
      .sort({ likesCount: -1, viewsCount: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      recipes
    });
  } catch (error) {
    console.error('Get trending recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending recipes'
    });
  }
});

// @route   GET /api/recipes/random
// @desc    Get random recipe
// @access  Public
router.get('/random', async (req, res) => {
  try {
    const count = await Recipe.countDocuments({
      isPublic: true,
      status: 'approved'
    });

    const random = Math.floor(Math.random() * count);

    const recipe = await Recipe.findOne({
      isPublic: true,
      status: 'approved'
    })
      .populate('author', 'name avatar')
      .skip(random);

    res.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error('Get random recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching random recipe'
    });
  }
});

// @route   GET /api/recipes/new-feed
// @desc    Get newly published recipes
// @access  Public
router.get('/new-feed', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const recipes = await Recipe.find({
      isPublic: true,
      status: 'approved'
    })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Recipe.countDocuments({
      isPublic: true,
      status: 'approved'
    });

    res.json({
      success: true,
      recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get new feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching new recipes'
    });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar bio userType shopInfo');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Increment view count
    recipe.viewsCount += 1;
    await recipe.save();

    res.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe'
    });
  }
});

// @route   POST /api/recipes
// @desc    Create new recipe
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      author: req.user._id,
      status: 'pending' // All new recipes need approval
    };

    const recipe = await Recipe.create(recipeData);

    // Update user's recipe count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { recipesCount: 1 }
    });

    res.status(201).json({
      success: true,
      recipe,
      message: 'Recipe created successfully and submitted for review'
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating recipe'
    });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private (Owner only)
router.put('/:id', protect, isRecipeOwner, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        status: 'pending' // Reset to pending after edit
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      recipe,
      message: 'Recipe updated and resubmitted for review'
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating recipe'
    });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private (Owner only)
router.delete('/:id', protect, isRecipeOwner, async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);

    // Update user's recipe count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { recipesCount: -1 }
    });

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe'
    });
  }
});

// @route   GET /api/recipes/user/:userId
// @desc    Get user's recipes
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const query = {
      author: req.params.userId,
      isPublic: true,
      status: 'approved'
    };

    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Recipe.countDocuments(query);

    res.json({
      success: true,
      recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user recipes'
    });
  }
});

// @route   GET /api/recipes/my/all
// @desc    Get current user's all recipes (including private and pending)
// @access  Private
router.get('/my/all', protect, async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;

    const query = { author: req.user._id };
    if (status) query.status = status;

    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Recipe.countDocuments(query);

    res.json({
      success: true,
      recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get my recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes'
    });
  }
});

// @route   GET /api/recipes/:id/pdf
// @desc    Generate PDF for single recipe
// @access  Public
router.get('/:id/pdf', async (req, res) => {
  try {
    const pdfBuffer = await generateRecipePDF(req.params.id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=recipe-${req.params.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Generate recipe PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF'
    });
  }
});

// @route   POST /api/recipes/recipe-book/pdf
// @desc    Generate PDF for multiple recipes (recipe book)
// @access  Private
router.post('/recipe-book/pdf', protect, async (req, res) => {
  try {
    const { recipeIds, bookTitle, coverOptions } = req.body;

    if (!recipeIds || recipeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one recipe ID is required'
      });
    }

    const pdfBuffer = await generateRecipeBookPDF(
      recipeIds,
      bookTitle || 'My Recipe Book',
      coverOptions || {}
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${bookTitle || 'recipe-book'}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Generate recipe book PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recipe book PDF'
    });
  }
});

export default router;
