const router = require("express").Router();
const ProductController = require("../../controllers/product/product");
const authMiddleware = require("../../middlewares/auth");


router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getByIdValidator, ProductController.getById);
router.post("/",authMiddleware.isAuthenticated, authMiddleware.isAdmin, ProductController.createValidator, ProductController.create);
router.put("/:id", authMiddleware.isAuthenticated ,authMiddleware.isAdmin, ProductController.updateValidator, ProductController.update);
router.delete("/:id",authMiddleware.isAuthenticated , authMiddleware.isAdmin, ProductController.deleteValidator, ProductController.delete);

module.exports = router;
