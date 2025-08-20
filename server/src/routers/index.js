const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/product", require("./product"));
router.use("/cart", require("./cart"));
router.use("/order" ,require("./order"))


module.exports = router;
