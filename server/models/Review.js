import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [{
    url: String,
    caption: String
  }],

  // Did the user cook this recipe?
  didCook: {
    type: Boolean,
    default: false
  },

  // Modifications made
  modifications: {
    type: String
  },

  // Helpful votes
  helpfulCount: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Verified purchase (for shop orders)
  verifiedPurchase: {
    type: Boolean,
    default: false
  },

  // Status
  isVisible: {
    type: Boolean,
    default: true
  },

  // Response from author/shop
  response: {
    text: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews
reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
