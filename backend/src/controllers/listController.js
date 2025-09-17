const TaskList = require("../models/TaskList");
const Task = require("../models/Task");

exports.createList = async (req, res) => {
  try {
    const { nome } = req.body;
    const list = new TaskList({ nome, userId: req.user.id });
    await list.save();
    res.status(201).json(list);
  } catch {
    res.status(500).json({ error: "Erro ao criar lista" });
  }
};

exports.getLists = async (req, res) => {
  try {
    const lists = await TaskList.find({ userId: req.user.id });
    res.json(lists);
  } catch {
    res.status(500).json({ error: "Erro ao buscar listas" });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se a lista existe e pertence ao usuário logado
    const list = await TaskList.findOne({ _id: id, userId: req.user.id });
    if (!list) {
      return res.status(404).json({ error: "Lista não encontrada" });
    }

    // Remove todas as tarefas vinculadas a essa lista
    await Task.deleteMany({ listaId: id });

    // Remove a lista
    await TaskList.findByIdAndDelete(id);

    res.json({ message: "Lista e tarefas vinculadas removidas com sucesso" });
  } catch (error) {
    console.error("Erro ao remover lista:", error);
    res.status(500).json({ error: "Erro ao remover lista" });
  }
};