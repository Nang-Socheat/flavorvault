import express from 'express';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin', 'expert'));

// @route   GET /api/admin/pending-recipes
// @desc    Get all pending recipes for review
// @access  Private (Admin/Expert only)
router.get('/pending-recipes', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const recipes = await Recipe.find({ status: 'pending' })
      .populate('author', 'name avatar email userType')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Recipe.countDocuments({ status: 'pending' });

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
    console.error('Get pending recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending recipes'
    });
  }
});

// @route   PUT /api/admin/recipes/:id/approve
// @desc    Approve a recipe
// @access  Private (Admin/Expert only)
router.put('/recipes/:id/approve', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    recipe.status = 'approved';
    recipe.reviewedBy = req.user._id;
    recipe.reviewedAt = new Date();
    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe approved successfully',
      recipe
    });
  } catch (error) {
    console.error('Approve recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving recipe'
    });
  }
});

// @route   PUT /api/admin/recipes/:id/reject
// @desc    Reject a recipe
// @access  Private (Admin/Expert only)
router.put('/recipes/:id/reject', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    recipe.status = 'rejected';
    recipe.rejectionReason = req.body.reason || 'Does not meet quality standards';
    recipe.reviewedBy = req.user._id;
    recipe.reviewedAt = new Date();
    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe rejected',
      recipe
    });
  } catch (error) {
    console.error('Reject recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting recipe'
    });
  }
});

// @route   POST /api/admin/recipes/:id/feature
// @desc    Feature a recipe
// @access  Private (Admin only)
router.post('/recipes/:id/feature', authorize('admin'), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    recipe.isFeatured = !recipe.isFeatured;
    recipe.featuredAt = recipe.isFeatured ? new Date() : null;
    await recipe.save();

    res.json({
      success: true,
      message: recipe.isFeatured ? 'Recipe featured' : 'Recipe unfeatured',
      recipe
    });
  } catch (error) {
    console.error('Feature recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error featuring recipe'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, role, userType, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (userType) query.userType = userType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/users/:id/role', authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'expert', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Activate/deactivate user account
// @access  Private (Admin only)
router.put('/users/:id/status', authorize('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User account ${isActive ? 'activated' : 'deactivated'}`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status'
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/stats', authorize('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalRecipes,
      pendingRecipes,
      approvedRecipes,
      totalShops
    ] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Recipe.countDocuments({ status: 'pending' }),
      Recipe.countDocuments({ status: 'approved' }),
      User.countDocuments({ userType: { $in: ['shop', 'restaurant'] } })
    ]);

    // Get recent activity
    const recentRecipes = await Recipe.find({ status: 'pending' })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRecipes,
        pendingRecipes,
        approvedRecipes,
        totalShops
      },
      recentActivity: {
        recipes: recentRecipes,
        users: recentUsers
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

export default router;
