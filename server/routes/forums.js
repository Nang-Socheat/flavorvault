import express from 'express';
import Forum from '../models/Forum.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/forums
// @desc    Get all forum posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const forums = await Forum.find(query)
      .populate('author', 'name avatar')
      .populate('relatedRecipe', 'title images')
      .populate('replies.user', 'name avatar')
      .sort({ isPinned: -1, ...sortOptions })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Forum.countDocuments(query);

    res.json({
      success: true,
      forums,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get forums error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forums'
    });
  }
});

// @route   GET /api/forums/:id
// @desc    Get single forum post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id)
      .populate('author', 'name avatar bio')
      .populate('relatedRecipe')
      .populate('replies.user', 'name avatar');

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    // Increment view count
    forum.viewsCount += 1;
    await forum.save();

    res.json({
      success: true,
      forum
    });
  } catch (error) {
    console.error('Get forum error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forum post'
    });
  }
});

// @route   POST /api/forums
// @desc    Create forum post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category, relatedRecipe, tags } = req.body;

    const forum = await Forum.create({
      title,
      content,
      author: req.user._id,
      category,
      relatedRecipe,
      tags
    });

    const populatedForum = await Forum.findById(forum._id)
      .populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      forum: populatedForum
    });
  } catch (error) {
    console.error('Create forum error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating forum post'
    });
  }
});

// @route   POST /api/forums/:id/replies
// @desc    Add reply to forum post
// @access  Private
router.post('/:id/replies', protect, async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    if (forum.isClosed) {
      return res.status(400).json({
        success: false,
        message: 'This forum post is closed for replies'
      });
    }

    forum.replies.push({
      user: req.user._id,
      content: req.body.content
    });

    await forum.save();

    const populatedForum = await Forum.findById(forum._id)
      .populate('author', 'name avatar')
      .populate('replies.user', 'name avatar');

    // Emit real-time update via socket.io
    const io = req.app.get('io');
    io.to(`forum-${forum._id}`).emit('new-reply', {
      forumId: forum._id,
      reply: forum.replies[forum.replies.length - 1]
    });

    res.json({
      success: true,
      forum: populatedForum
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reply'
    });
  }
});

// @route   POST /api/forums/:id/like
// @desc    Like forum post
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    if (forum.likedBy.includes(req.user._id)) {
      // Unlike
      forum.likedBy = forum.likedBy.filter(
        id => id.toString() !== req.user._id.toString()
      );
      forum.likesCount -= 1;
    } else {
      // Like
      forum.likedBy.push(req.user._id);
      forum.likesCount += 1;
    }

    await forum.save();

    res.json({
      success: true,
      likesCount: forum.likesCount,
      isLiked: forum.likedBy.includes(req.user._id)
    });
  } catch (error) {
    console.error('Like forum error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking forum post'
    });
  }
});

// @route   POST /api/forums/:forumId/replies/:replyId/like
// @desc    Like forum reply
// @access  Private
router.post('/:forumId/replies/:replyId/like', protect, async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.forumId);

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    const reply = forum.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    if (reply.likedBy.includes(req.user._id)) {
      // Unlike
      reply.likedBy = reply.likedBy.filter(
        id => id.toString() !== req.user._id.toString()
      );
      reply.likes -= 1;
    } else {
      // Like
      reply.likedBy.push(req.user._id);
      reply.likes += 1;
    }

    await forum.save();

    res.json({
      success: true,
      likes: reply.likes,
      isLiked: reply.likedBy.includes(req.user._id)
    });
  } catch (error) {
    console.error('Like reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking reply'
    });
  }
});

export default router;
