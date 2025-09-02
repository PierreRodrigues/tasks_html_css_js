const TaskList = require("../models/TaskList");

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
