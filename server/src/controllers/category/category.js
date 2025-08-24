const { body, param, validationResult } = require('express-validator');
const Category = require('../../models/category');
const Product = require('../../models/product');

class CategoryController {
  // GET /categories
  async getAll(req, res) {
    try {
      const { includeInactive = false, parentOnly = false } = req.query;
      
      const filter = {};
      if (!includeInactive) {
        filter.isActive = true;
      }
      if (parentOnly === 'true') {
        filter.parentCategory = null;
      }

      const categories = await Category.find(filter)
        .populate('parentCategory', 'name slug')
        .populate('subcategories')
        .sort({ sortOrder: 1, name: 1 });

      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }

  getByIdValidator = [
    param('id').isMongoId().withMessage('Invalid category ID'),
  ]

  // GET /categories/:id
  async getById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const category = await Category.findById(id)
        .populate('parentCategory', 'name slug')
        .populate('subcategories');
        
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }

  createValidator = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('parentCategory').optional().isMongoId().withMessage('Invalid parent category ID'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer'),
  ]

  // POST /categories (admin only)
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const categoryData = { ...req.body };
      categoryData.createdBy = req.user._id;

      // Handle image uploaded via multer
      if (req.file) {
        categoryData.image = {
          url: `/uploads/categories/${req.file.filename}`,
          alt: req.file.originalname
        };
      }

      const category = new Category(categoryData);
      await category.save();
      
      // Emit real-time notification to admins
      const io = req.app.get('io');
      if (io) {
        io.to('admin').emit('category_created', {
          categoryId: category._id,
          name: category.name,
          createdAt: category.createdAt
        });
      }
      
      res.status(201).json(category);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Category name already exists' });
      }
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }

  updateValidator = [
    param('id').isMongoId().withMessage('Invalid category ID'),
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('parentCategory').optional().isMongoId().withMessage('Invalid parent category ID'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer'),
  ]

  // PUT /categories/:id (admin only)
  async update(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updateData = { ...req.body };

      // Handle image uploaded via multer
      if (req.file) {
        updateData.image = {
          url: `/uploads/categories/${req.file.filename}`,
          alt: req.file.originalname
        };
      }

      const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(category);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Category name already exists' });
      }
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }

  deleteValidator = [
    param('id').isMongoId().withMessage('Invalid category ID'),
  ]

  // DELETE /categories/:id (admin only)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if category has products
      const productCount = await Product.countDocuments({ category: id });
      if (productCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete category with existing products. Please reassign or delete products first.' 
        });
      }

      // Check if category has subcategories
      const subcategoryCount = await Category.countDocuments({ parentCategory: id });
      if (subcategoryCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete category with subcategories. Please delete subcategories first.' 
        });
      }

      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // Emit real-time notification to admins
      const io = req.app.get('io');
      if (io) {
        io.to('admin').emit('category_deleted', {
          categoryId: id,
          name: category.name,
          deletedAt: new Date()
        });
      }
      
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
}

module.exports = new CategoryController();