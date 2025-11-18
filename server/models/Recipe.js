import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  // Basic information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },

  // Author
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Images and videos
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  videos: [{
    url: String,
    platform: {
      type: String,
      enum: ['youtube', 'tiktok', 'instagram', 'vimeo', 'other']
    },
    title: String
  }],

  // Time
  prepTime: {
    type: Number,
    required: true // in minutes
  },
  cookTime: {
    type: Number,
    required: true // in minutes
  },
  totalTime: {
    type: Number
  },

  // Servings and difficulty
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },

  // Categorization
  category: {
    type: String,
    required: true,
    enum: [
      'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Dessert',
      'Quick & Easy', 'Healthy', 'Family', 'Seasonal', 'Regional'
    ]
  },
  subCategory: [{
    type: String,
    enum: [
      'Meat', 'Vegan', 'Vegetarian', 'Seafood', 'Bakery',
      'Soup', 'Salad', 'Drinks', 'Appetizers', 'Side Dishes'
    ]
  }],
  occasion: [{
    type: String,
    enum: [
      'Khmer New Year', 'Pchum Ben', 'Water Festival',
      'Family Reunion', 'Birthday', 'Wedding', 'Holiday',
      'Everyday', 'Party', 'Picnic'
    ]
  }],

  // Origin and cuisine
  origin: {
    country: String,
    region: String
  },
  cuisineType: {
    type: String,
    enum: [
      'Khmer', 'Thai', 'Vietnamese', 'Chinese', 'Japanese',
      'Korean', 'Indian', 'Italian', 'French', 'Mexican',
      'American', 'Mediterranean', 'Fusion', 'Other'
    ]
  },

  // Ingredients
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    notes: String,
    optional: {
      type: Boolean,
      default: false
    }
  }],

  // Instructions
  instructions: [{
    stepNumber: Number,
    description: {
      type: String,
      required: true
    },
    image: String,
    video: String,
    timer: Number // in minutes
  }],

  // Nutrition information
  nutrition: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number,
    cholesterol: Number,
    servingSize: String
  },

  // Tags
  tags: [{
    type: String
  }],

  // Privacy and status
  isPublic: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,

  // Review by expert
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,

  // Allergens
  allergens: [{
    type: String,
    enum: [
      'dairy', 'eggs', 'fish', 'shellfish', 'tree-nuts',
      'peanuts', 'wheat', 'soy', 'sesame', 'gluten'
    ]
  }],

  // Engagement metrics
  viewsCount: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  },
  favoritesCount: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  cookedCount: {
    type: Number,
    default: 0
  },

  // Toxic ingredient check
  hasToxicCombination: {
    type: Boolean,
    default: false
  },
  toxicWarning: String,

  // Featured
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredAt: Date,

  // For shops/restaurants
  price: Number,
  availableForOrder: {
    type: Boolean,
    default: false
  },
  preparationNote: String
}, {
  timestamps: true
});

// Calculate total time before saving
recipeSchema.pre('save', function(next) {
  this.totalTime = this.prepTime + this.cookTime;
  next();
});

// Index for search
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ author: 1 });
recipeSchema.index({ status: 1, isPublic: 1 });
recipeSchema.index({ averageRating: -1 });
recipeSchema.index({ createdAt: -1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
