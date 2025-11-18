import express from 'express';
import Review from '../models/Review.js';
import Recipe from '../models/Recipe.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reviews/recipe/:recipeId
// @desc    Get reviews for a recipe
// @access  Public
router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const reviews = await Review.find({
      recipe: req.params.recipeId,
      isVisible: true
    })
      .populate('user', 'name avatar')
      .populate('response.respondedBy', 'name avatar')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Review.countDocuments({
      recipe: req.params.recipeId,
      isVisible: true
    });

    // Calculate average rating
    const stats = await Review.aggregate([
      { $match: { recipe: req.params.recipeId, isVisible: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingCounts: {
            $push: '$rating'
          }
        }
      }
    ]);

    res.json({
      success: true,
      reviews,
      stats: stats[0] || { averageRating: 0, totalReviews: 0 },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { recipe, rating, title, comment, didCook, modifications, images } = req.body;

    // Check if recipe exists
    const recipeDoc = await Recipe.findById(recipe);
    if (!recipeDoc) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user already reviewed this recipe
    const existingReview = await Review.findOne({
      recipe,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this recipe'
      });
    }

    // Create review
    const review = await Review.create({
      recipe,
      user: req.user._id,
      rating,
      title,
      comment,
      didCook,
      modifications,
      images
    });

    // Update recipe stats
    const allReviews = await Review.find({ recipe, isVisible: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    recipeDoc.averageRating = avgRating;
    recipeDoc.reviewsCount = allReviews.length;
    await recipeDoc.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review'
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private (Owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, title, comment, didCook, modifications, images } = req.body;

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.didCook = didCook !== undefined ? didCook : review.didCook;
    review.modifications = modifications || review.modifications;
    review.images = images || review.images;

    await review.save();

    // Update recipe average rating
    const allReviews = await Review.find({ recipe: review.recipe, isVisible: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Recipe.findByIdAndUpdate(review.recipe, {
      averageRating: avgRating
    });

    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private (Owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const recipeId = review.recipe;
    await Review.findByIdAndDelete(req.params.id);

    // Update recipe stats
    const allReviews = await Review.find({ recipe: recipeId, isVisible: true });
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: avgRating,
      reviewsCount: allReviews.length
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.helpfulBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You already marked this review as helpful'
      });
    }

    review.helpfulBy.push(req.user._id);
    review.helpfulCount += 1;
    await review.save();

    res.json({
      success: true,
      message: 'Marked as helpful'
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking review as helpful'
    });
  }
});

// @route   POST /api/reviews/:id/response
// @desc    Respond to a review (recipe author/shop only)
// @access  Private
router.post('/:id/response', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('recipe');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the recipe author
    if (review.recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only recipe author can respond to reviews'
      });
    }

    review.response = {
      text: req.body.text,
      respondedAt: new Date(),
      respondedBy: req.user._id
    };

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar')
      .populate('response.respondedBy', 'name avatar');

    res.json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error responding to review'
    });
  }
});

export default router;
