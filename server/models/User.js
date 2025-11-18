import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },

  // User type
  userType: {
    type: String,
    enum: ['individual', 'shop', 'restaurant'],
    default: 'individual'
  },

  // Profile information
  bio: {
    type: String,
    maxlength: 500
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  skills: [{
    type: String
  }],
  experience: {
    type: String
  },

  // Social media links
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
    tiktok: String,
    website: String
  },

  // Dietary preferences and allergies
  allergies: [{
    type: String
  }],
  dietaryPreferences: [{
    type: String,
    enum: ['vegan', 'vegetarian', 'halal', 'kosher', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'paleo', 'pescatarian']
  }],

  // Preferences
  measurementUnit: {
    type: String,
    enum: ['metric', 'imperial'],
    default: 'metric'
  },
  measurementPreferences: {
    weight: {
      type: String,
      enum: ['grams', 'ounces', 'pounds'],
      default: 'grams'
    },
    volume: {
      type: String,
      enum: ['ml', 'cups', 'fluid-ounces'],
      default: 'ml'
    }
  },

  // Theme preferences
  themeColor: {
    type: String,
    default: '#3B82F6'
  },
  background: {
    type: String,
    default: 'light'
  },

  // Shop/Restaurant specific fields
  shopInfo: {
    businessName: String,
    businessType: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    phone: String,
    businessHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    deliveryAvailable: {
      type: Boolean,
      default: false
    },
    minimumOrder: {
      type: Number,
      default: 0
    },
    logo: String,
    coverImage: String
  },

  // User role
  role: {
    type: String,
    enum: ['user', 'expert', 'admin'],
    default: 'user'
  },

  // Account status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Stats
  followersCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  recipesCount: {
    type: Number,
    default: 0
  },

  // Favorites and collections
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],

  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Email verification
  verificationToken: String,
  verificationTokenExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  delete obj.verificationToken;
  delete obj.verificationTokenExpire;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
