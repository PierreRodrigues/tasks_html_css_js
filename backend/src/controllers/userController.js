const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-senha"); // não retorna senha
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    print(user)
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};