const {
  body,
  param,
  query,
  validationResult
} = require('express-validator');
const Product = require('../../models/product');

class ProductController {
  // GET /products?search=&category=&minPrice=&maxPrice=&tags=&featured=&isActive=&page=&limit=
  async getAll(req, res) {
    try {
      let {
        search,
        category,
        minPrice,
        maxPrice,
        tags,
        featured,
        isActive,
        page = 1,
        limit = 20,
      } = req.query;

      const filter = {};

      // sanitize "undefined" / "null" values
      search = search && search !== "undefined" && search !== "null" ? search.trim() : null;
      category = category && category !== "undefined" && category !== "null" ? category.trim() : null;
      tags = tags && tags !== "undefined" && tags !== "null" ? tags : null;

      if (search) filter.$text = { $search: search };
      if (category) filter.category = category.toLowerCase();
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice && minPrice !== "undefined") filter.price.$gte = Number(minPrice);
        if (maxPrice && maxPrice !== "undefined") filter.price.$lte = Number(maxPrice);
      }
      if (tags) filter.tags = { $in: tags.split(",").map(t => t.trim().toLowerCase()) };
      if (featured !== undefined && featured !== "undefined") filter.featured = featured === "true";
      if (isActive !== undefined && isActive !== "undefined") filter.isActive = isActive === "true";

      // fetch products with category name only
      const products = await Product.find(filter)
        .populate("category", "name")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean();

      // transform category object -> just category.name
      const transformed = products.map(p => ({
        ...p,
        category: p.category?.name || null,
      }));

      const total = await Product.countDocuments(filter);

      res.json({
        products: transformed,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }

  getByIdValidator = [
    param('id').isMongoId().withMessage('Invalid product ID'),
  ]

  // GET /products/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).populate("category", "name").lean();
      if (!product) return res.status(404).json({ error: 'Product not found' });

      res.json({
        ...product,
        category: product.category?.name || null,
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }

  // validator for creating products
  createValidator = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('description').isString().trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isString().trim().notEmpty().withMessage('Category is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ]

  // POST /products (admin only)
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const productData = { ...req.body };

      // Handle images uploaded via multer
      if (req.files && req.files.length > 0) {
        productData.images = req.files.map((file, idx) => ({
          url: `/uploads/products/${file.filename}`,
          alt: file.originalname,
          isMain: idx === 0,
        }));
      }

      productData.createdBy = req.user._id;

      const product = new Product(productData);
      await product.save();

      const populated = await Product.findById(product._id).populate("category", "name").lean();

      // Emit real-time notification
      const io = req.app.get('io');
      if (io) {
        io.to('admin').emit('product_created', {
          productId: product._id,
          name: product.name,
          createdAt: product.createdAt
        });
      }

      res.status(201).json({
        ...populated,
        category: populated.category?.name || null,
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }

  // validator for updating products
  updateValidator = [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('description').isString().trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isString().trim().notEmpty().withMessage('Category is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ]

  // PUT /products/:id (admin only)
  async update(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updateData = { ...req.body };

      // Handle images uploaded via multer
      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map((file, idx) => ({
          url: `/uploads/products/${file.filename}`,
          alt: file.originalname,
          isMain: idx === 0,
        }));
      }

      const product = await Product.findByIdAndUpdate(id, updateData, { new: true })
        .populate("category", "name")
        .lean();

      if (!product) return res.status(404).json({ error: 'Product not found' });

      // Stock alert
      const io = req.app.get('io');
      if (io && product.stock <= product.lowStockThreshold) {
        io.to('admin').emit('low_stock_alert', {
          productId: product._id,
          name: product.name,
          currentStock: product.stock,
          threshold: product.lowStockThreshold
        });
      }

      res.json({
        ...product,
        category: product.category?.name || null,
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }

  // validator for deletion 
  deleteValidator = [
    param('id').isMongoId().withMessage('Invalid product ID'),
  ]

  // DELETE /products/:id (admin only)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id).populate("category", "name").lean();
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // Emit real-time notification
      const io = req.app.get('io');
      if (io) {
        io.to('admin').emit('product_deleted', {
          productId: id,
          name: product.name,
          deletedAt: new Date()
        });
      }

      res.json({
        message: 'Product deleted',
        deletedProduct: {
          ...product,
          category: product.category?.name || null,
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
}

module.exports = new ProductController();
