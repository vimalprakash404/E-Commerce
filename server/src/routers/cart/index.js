const router  = require("express").Router();
const cartController = require("../../controllers/cart/cart");
const authenticate = require("../../middlewares/auth");

router.post("/add", authenticate.isAuthenticated , authenticate.isCustomer, cartController.addItem);
router.post("/remove",  authenticate.isAuthenticated , authenticate.isCustomer, cartController.removeItem);
router.post("/clear",  authenticate.isAuthenticated , authenticate.isCustomer, cartController.clearCart);
router.get("/", authenticate.isAuthenticated , authenticate.isCustomer, cartController.getAll);

module.exports = router;