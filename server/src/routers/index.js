const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/product", require("./product"));
router.use("/cart", require("./cart"));


module.exports = router;
