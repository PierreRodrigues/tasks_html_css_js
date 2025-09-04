const express = require("express");
const { createTask, getTasks, updateTask, deleteTask, getLastTasks } = require("../controllers/taskController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/", isAuthenticated, createTask);
router.get("/", isAuthenticated, getTasks);
router.get("/last", isAuthenticated, getLastTasks); // 👈 nova rota
router.put("/:id", isAuthenticated, updateTask);
router.patch("/:id", isAuthenticated, updateTask);
router.delete("/:id", isAuthenticated, deleteTask);

module.exports = router;
