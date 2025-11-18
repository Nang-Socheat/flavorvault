import express from 'express';
import Menu from '../models/Menu.js';
import { protect } from '../middleware/auth.js';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// @route   GET /api/menus/shop/:shopId
// @desc    Get shop's menus
// @access  Public
router.get('/shop/:shopId', async (req, res) => {
  try {
    const menus = await Menu.find({
      shop: req.params.shopId,
      isPublished: true,
      isActive: true
    }).populate('sections.items.recipe', 'title description images nutrition');

    res.json({
      success: true,
      menus
    });
  } catch (error) {
    console.error('Get shop menus error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menus'
    });
  }
});

// @route   GET /api/menus/my
// @desc    Get current user's menus (shop/restaurant only)
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    if (!['shop', 'restaurant'].includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Only shops and restaurants can create menus'
      });
    }

    const menus = await Menu.find({ shop: req.user._id })
      .populate('sections.items.recipe')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      menus
    });
  } catch (error) {
    console.error('Get my menus error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menus'
    });
  }
});

// @route   GET /api/menus/:id
// @desc    Get single menu
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate('shop', 'name shopInfo')
      .populate('sections.items.recipe');

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Check if published or user is owner
    if (!menu.isPublished &&
        (!req.user || menu.shop._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Menu is not published'
      });
    }

    res.json({
      success: true,
      menu
    });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu'
    });
  }
});

// @route   POST /api/menus
// @desc    Create menu
// @access  Private (Shop/Restaurant only)
router.post('/', protect, async (req, res) => {
  try {
    if (!['shop', 'restaurant'].includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Only shops and restaurants can create menus'
      });
    }

    const menu = await Menu.create({
      ...req.body,
      shop: req.user._id
    });

    res.status(201).json({
      success: true,
      menu
    });
  } catch (error) {
    console.error('Create menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating menu'
    });
  }
});

// @route   PUT /api/menus/:id
// @desc    Update menu
// @access  Private (Owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    if (menu.shop.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this menu'
      });
    }

    Object.assign(menu, req.body);
    await menu.save();

    res.json({
      success: true,
      menu
    });
  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu'
    });
  }
});

// @route   DELETE /api/menus/:id
// @desc    Delete menu
// @access  Private (Owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    if (menu.shop.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this menu'
      });
    }

    await Menu.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting menu'
    });
  }
});

// @route   POST /api/menus/:id/publish
// @desc    Publish menu
// @access  Private (Owner only)
router.post('/:id/publish', protect, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    if (menu.shop.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this menu'
      });
    }

    menu.isPublished = true;
    menu.publishedAt = new Date();
    await menu.save();

    res.json({
      success: true,
      menu
    });
  } catch (error) {
    console.error('Publish menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing menu'
    });
  }
});

// @route   GET /api/menus/:id/pdf
// @desc    Generate PDF for menu
// @access  Public
router.get('/:id/pdf', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate('shop', 'name shopInfo')
      .populate('sections.items.recipe');

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Generate HTML for PDF
    const html = generateMenuHTML(menu);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=menu-${menu.name}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF'
    });
  }
});

// Helper function to generate HTML for menu PDF
function generateMenuHTML(menu) {
  const { coverPage, sections, shop } = menu;

  let html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .cover-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: ${coverPage?.backgroundColor || '#f8f9fa'};
      color: ${coverPage?.textColor || '#333'};
      ${coverPage?.backgroundImage ? `background-image: url(${coverPage.backgroundImage}); background-size: cover;` : ''}
    }
    .cover-logo {
      max-width: 200px;
      margin-bottom: 20px;
    }
    .cover-name {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .cover-tagline {
      font-size: 24px;
      font-style: italic;
    }
    .menu-section {
      page-break-before: always;
      padding: 40px;
    }
    .section-title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 3px solid #333;
      padding-bottom: 10px;
    }
    .section-description {
      font-size: 16px;
      margin-bottom: 30px;
      color: #666;
    }
    .menu-item {
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
    }
    .item-details {
      flex: 1;
    }
    .item-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .item-description {
      font-size: 14px;
      color: #666;
    }
    .item-price {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover-page">
    ${coverPage?.logo ? `<img src="${coverPage.logo}" class="cover-logo" />` : ''}
    <div class="cover-name">${coverPage?.shopName || shop.name}</div>
    ${coverPage?.tagline ? `<div class="cover-tagline">${coverPage.tagline}</div>` : ''}
  </div>

  <!-- Menu Sections -->
  ${sections.map(section => `
    <div class="menu-section">
      <div class="section-title">${section.name}</div>
      ${section.description ? `<div class="section-description">${section.description}</div>` : ''}

      ${section.items.map(item => {
        if (!item.isAvailable) return '';
        return `
          <div class="menu-item">
            <div class="item-details">
              <div class="item-name">${item.name || item.recipe?.title}</div>
              <div class="item-description">${item.description || item.recipe?.description}</div>
            </div>
            <div class="item-price">$${item.price?.toFixed(2)}</div>
          </div>
        `;
      }).join('')}
    </div>
  `).join('')}
</body>
</html>
  `;

  return html;
}

export default router;
