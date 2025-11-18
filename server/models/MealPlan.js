import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },

  // Meal plan items
  meals: [{
    date: {
      type: Date,
      required: true
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    servings: {
      type: Number,
      default: 1
    },
    notes: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],

  // Google Calendar integration
  googleCalendarId: String,
  syncedWithGoogle: {
    type: Boolean,
    default: false
  },

  // Nutrition summary (calculated)
  totalNutrition: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;
