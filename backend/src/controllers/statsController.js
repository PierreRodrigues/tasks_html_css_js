const Task = require("../models/Task");

exports.getTaskStats = async (req, res) => {
  try {
    const userIdStr = req.user.id;

    // Estatísticas por status
    const statusStats = await Task.aggregate([
      { $match: { $expr: { $eq: ["$userId", { $toObjectId: userIdStr }] } } },
      { $group: { _id: "$status", total: { $sum: 1 } } }
    ]);

    // Estatísticas por prioridade
    const prioridadeStats = await Task.aggregate([
      { $match: { $expr: { $eq: ["$userId", { $toObjectId: userIdStr }] } } },
      { $group: { _id: "$prioridade", total: { $sum: 1 } } }
    ]);

    const result = {
      total: 0,
      statusStats: { iniciada: 0, cancelada: 0, concluída: 0 },
      prioridadeStats: { baixa: 0, média: 0, alta: 0, urgente: 0 }
    };

    // Popular status
    statusStats.forEach(s => {
      result.statusStats[s._id] = s.total;
      result.total += s.total;
    });

    // Popular prioridades
    prioridadeStats.forEach(p => {
      result.prioridadeStats[p._id] = p.total;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao calcular estatísticas" });
  }
};
