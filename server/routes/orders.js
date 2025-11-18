import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, type } = req.query;

    const query = {
      $or: [
        { customer: req.user._id },
        { shop: req.user._id }
      ]
    };

    if (status) query.status = status;
    if (type) query.orderType = type;

    const orders = await Order.find(query)
      .populate('customer', 'name avatar email phone')
      .populate('shop', 'name shopInfo')
      .populate('items.recipe', 'title images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name avatar email phone')
      .populate('shop', 'name shopInfo')
      .populate('items.recipe');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is customer or shop
    if (
      order.customer._id.toString() !== req.user._id.toString() &&
      order.shop._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      shop,
      orderType,
      items,
      deliveryAddress,
      deliveryMethod,
      paymentMethod,
      customerNotes
    } = req.body;

    // Calculate totals
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.itemTotal;
    });

    const deliveryFee = deliveryMethod === 'delivery' ? 5 : 0; // Example fee
    const tax = subtotal * 0.1; // 10% tax example
    const total = subtotal + deliveryFee + tax;

    const order = await Order.create({
      customer: req.user._id,
      shop,
      orderType,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress,
      deliveryMethod,
      paymentMethod,
      customerNotes
    });

    // Emit real-time notification to shop
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber
    });

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (shop only)
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is the shop
    if (order.shop.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    const { status, note } = req.body;

    order.status = status;
    order.statusHistory.push({
      status,
      note
    });

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    // Emit real-time update to customer
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('order-status-updated', {
      orderId: order._id,
      status,
      note
    });

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is customer or shop
    if (
      order.customer.toString() !== req.user._id.toString() &&
      order.shop.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel if not yet delivered
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this order'
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = req.body.reason;
    order.cancelledBy = req.user._id;
    order.statusHistory.push({
      status: 'cancelled',
      note: req.body.reason
    });

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order'
    });
  }
});

// @route   POST /api/orders/:id/calculate-price
// @desc    Calculate order price with customizations
// @access  Public
router.post('/calculate-price', async (req, res) => {
  try {
    const { items } = req.body;

    let subtotal = 0;

    // Calculate price for each item
    const calculatedItems = items.map(item => {
      let itemPrice = item.basePrice * item.quantity;

      // Add customization costs
      if (item.customizations) {
        // Add logic for customization pricing
        itemPrice += item.customizations.length * 1; // Example: $1 per customization
      }

      return {
        ...item,
        itemTotal: itemPrice
      };
    });

    calculatedItems.forEach(item => {
      subtotal += item.itemTotal;
    });

    const deliveryFee = 5; // Example
    const tax = subtotal * 0.1;
    const total = subtotal + deliveryFee + tax;

    res.json({
      success: true,
      pricing: {
        items: calculatedItems,
        subtotal,
        deliveryFee,
        tax,
        total
      }
    });
  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating price'
    });
  }
});

export default router;
