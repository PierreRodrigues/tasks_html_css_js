const mongoose = require("mongoose");

const TaskListSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("TaskList", TaskListSchema);