const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require("../controllers/user");

// Handle incoming requests from /users
router.post("/signup", UserController.create_user);

router.post("/login", UserController.login_user);

router.delete("/:userId", checkAuth, UserController.delete_user);

module.exports = router;