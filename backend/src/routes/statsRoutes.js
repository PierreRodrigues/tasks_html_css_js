const express = require("express");
const { getTaskStats } = require("../controllers/statsController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/", isAuthenticated, getTaskStats);

module.exports = router;
