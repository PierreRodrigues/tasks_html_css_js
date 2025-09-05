const Task = require("../models/Task");
const { Types } = require("mongoose");

// Criar tarefa
exports.createTask = async (req, res) => {
  try {
    const { descricao, listaId, prioridade, status } = req.body;

    if (!Types.ObjectId.isValid(listaId)) {
      return res.status(400).json({ error: "listaId inválido" });
    }

    const task = new Task({
      descricao,
      prioridade: prioridade || "média",
      status: status || "iniciada",
      listaId,
      userId: req.user.id || req.user._id, // 👈 cobre os dois casos
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};

// Listar todas as tarefas do usuário

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const listaId = req.query.listaId;

    // Filtro básico
    const filtro = { userId };
    if (listaId) filtro.listaId = listaId;

    // Busca tarefas populando listaId para pegar o nome
    const tasks = await Task.find(filtro)
      .populate("listaId", "nome") // popula apenas o campo nome da lista
      .sort({ createdAt: -1 });

    console.log(tasks);
    // Retorna tarefas já com listaNome
    res.json(
      tasks.map((task) => ({
        _id: task._id,
        descricao: task.descricao,
        status: task.status,
        prioridade: task.prioridade,
        listaId: task.listaId?._id || null,
        listaNome: task.listaId?.nome || "Sem lista",
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};

// Atualizar tarefa
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID da tarefa inválido" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
};

// Deletar tarefa
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID da tarefa inválido" });
    }

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

    res.json({ message: "Tarefa removida" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao remover tarefa" });
  }
};

// Últimas 5 tarefas
exports.getLastTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .populate("listaId", "nome")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(tasks.map(task => ({
      _id: task._id,
      descricao: task.descricao,
      status: task.status,
      prioridade: task.prioridade,
      listaId: task.listaId?._id || null,
      listaNome: task.listaId?.nome || "Sem lista",
      createdAt: task.createdAt
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar últimas tarefas" });
  }
};
