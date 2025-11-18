import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
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
  coverImage: {
    type: String
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  isPublic: {
    type: Boolean,
    default: false
  },

  // For categorization
  tags: [{
    type: String
  }],

  // Stats
  followersCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
