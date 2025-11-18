import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Order type
  orderType: {
    type: String,
    enum: ['food', 'ingredients'],
    required: true
  },

  // Items
  items: [{
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    name: String,
    quantity: Number,
    basePrice: Number,

    // Customizations for food orders
    customizations: [{
      type: String
    }],
    excludedIngredients: [{
      type: String
    }],
    specialInstructions: String,

    // For ingredient orders
    isIngredient: Boolean,
    unit: String,

    // Calculated price
    itemTotal: Number
  }],

  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },

  // Delivery information
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
    notes: String
  },
  deliveryMethod: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },

  // Order status
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'preparing', 'ready',
      'out-for-delivery', 'delivered', 'cancelled', 'refunded'
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],

  // Payment
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,

  // Timing
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,

  // Customer notes
  customerNotes: String,

  // Shop notes
  shopNotes: String,

  // Cancellation
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Review
  reviewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
