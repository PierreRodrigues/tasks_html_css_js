const express = require("express");
const { createList, getLists } = require("../controllers/listController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/", isAuthenticated, createList);
router.get("/", isAuthenticated, getLists);

module.exports = router;
