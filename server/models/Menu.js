import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  shop: {
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

  // Cover design
  coverPage: {
    logo: String,
    shopName: String,
    tagline: String,
    backgroundColor: String,
    textColor: String,
    backgroundImage: String
  },

  // Menu sections
  sections: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    items: [{
      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      name: String,
      description: String,
      price: Number,
      image: String,

      // Display options
      showIngredients: {
        type: Boolean,
        default: true
      },
      hideIngredientAmounts: {
        type: Boolean,
        default: false
      },

      // Availability
      isAvailable: {
        type: Boolean,
        default: true
      },
      availableDays: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }],
      availableTimes: {
        start: String,
        end: String
      },

      // Customization options
      customizationOptions: [{
        name: String,
        options: [{
          name: String,
          priceModifier: Number
        }]
      }]
    }]
  }],

  // Menu type
  menuType: {
    type: String,
    enum: ['dine-in', 'takeout', 'delivery', 'catering'],
    default: 'dine-in'
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,

  // PDF version
  pdfUrl: String,
  lastGeneratedPdf: Date
}, {
  timestamps: true
});

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
