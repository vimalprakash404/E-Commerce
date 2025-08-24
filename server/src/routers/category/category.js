const router = require("express").Router();
const CategoryController = require("../../controllers/category/category");
const authMiddleware = require("../../middlewares/auth");
const { upload, multerErrorHandler } = require("../../middlewares/upload");

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getByIdValidator, CategoryController.getById);
router.post("/", 
  authMiddleware.isAuthenticated, 
  authMiddleware.isAdmin, 
  upload.single("image"), 
  multerErrorHandler, 
  CategoryController.createValidator, 
  CategoryController.create
);
router.put("/:id", 
  authMiddleware.isAuthenticated, 
  authMiddleware.isAdmin, 
  upload.single("image"), 
  multerErrorHandler, 
  CategoryController.updateValidator, 
  CategoryController.update
);
router.delete("/:id", 
  authMiddleware.isAuthenticated, 
  authMiddleware.isAdmin, 
  CategoryController.deleteValidator, 
  CategoryController.delete
);

module.exports = router;