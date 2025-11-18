import mongoose from 'mongoose';

const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: [
      'general', 'techniques', 'ingredients', 'equipment',
      'troubleshooting', 'tips', 'regional-cuisine', 'nutrition'
    ],
    default: 'general'
  },

  // Related recipe (optional)
  relatedRecipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },

  // Tags
  tags: [{
    type: String
  }],

  // Replies
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: Number,
      default: 0
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],

  // Engagement
  viewsCount: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Status
  isPinned: {
    type: Boolean,
    default: false
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
forumSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Forum = mongoose.model('Forum', forumSchema);

export default Forum;
