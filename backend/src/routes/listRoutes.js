const express = require("express");
const { createList, getLists, deleteList } = require("../controllers/listController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/", isAuthenticated, createList);
router.get("/", isAuthenticated, getLists);
router.delete("/:id", isAuthenticated, deleteList);

module.exports = router;
