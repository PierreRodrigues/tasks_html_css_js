const Task = require("../models/Task");

exports.getTaskStats = async (req, res) => {
  try {
    const userIdStr = req.user.id; // string do JWT

    const stats = await Task.aggregate([
      {
        $match: {
          $expr: { $eq: ["$userId", { $toObjectId: userIdStr }] } // converte string para ObjectId no pipeline
        }
      },
      { $group: { _id: "$status", total: { $sum: 1 } } }
    ]);

    const result = { iniciada: 0, cancelada: 0, concluída: 0 };
    stats.forEach(s => { result[s._id] = s.total; });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao calcular estatísticas" });
  }
};
