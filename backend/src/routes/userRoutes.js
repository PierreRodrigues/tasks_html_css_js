const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middlewares/isAuthenticated");

router.get("/me", authMiddleware, UserController.getMe);

module.exports = router;