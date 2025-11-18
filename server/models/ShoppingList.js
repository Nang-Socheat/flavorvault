import mongoose from 'mongoose';

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'My Shopping List'
  },

  // Items from recipes
  recipeItems: [{
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    ingredient: String,
    quantity: Number,
    unit: String,
    checked: {
      type: Boolean,
      default: false
    }
  }],

  // Custom items added by user
  customItems: [{
    name: String,
    quantity: Number,
    unit: String,
    category: String,
    checked: {
      type: Boolean,
      default: false
    }
  }],

  // Auto-summed ingredients (combined from multiple recipes)
  consolidatedItems: [{
    ingredient: String,
    totalQuantity: Number,
    unit: String,
    recipes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    checked: {
      type: Boolean,
      default: false
    }
  }],

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  completedAt: Date
}, {
  timestamps: true
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

export default ShoppingList;
