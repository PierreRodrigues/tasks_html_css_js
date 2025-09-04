const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    descricao: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["iniciada", "cancelada", "concluída"], 
      default: "iniciada" 
    },
    prioridade: {
      type: String,
      enum: ["baixa", "média", "alta", "urgente"],
      default: "média"
    },
    listaId: { type: mongoose.Schema.Types.ObjectId, ref: "TaskList", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
