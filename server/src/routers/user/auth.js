const router = require("express").Router();
const AuthController = require("../../controllers/user/auth");

router.post("/register", AuthController.registerValidator, AuthController.register);
router.post("/login/:userType", AuthController.loginValidator, AuthController.login);
router.post("/logout", AuthController.logout);

module.exports = router;