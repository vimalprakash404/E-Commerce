const orderController = require("../../controllers/order/order")
const router = require("express").Router();
const authenticate = require("../../middlewares/auth");

router.post("/", authenticate.isAuthenticated , authenticate.isCustomer,orderController.placeOrderValidator, orderController.placeOrder);
router.get("/users", authenticate.isAuthenticated , authenticate.isCustomer , orderController.getUserOrders);
router.get("/admin", authenticate.isAuthenticated , authenticate.isAdmin , orderController.getAllOrders);
router.put("/:id", authenticate.isAuthenticated , authenticate.isAdmin , orderController.updateOrderStatusValidator , orderController.updateOrderStatus);

module.exports = router ;