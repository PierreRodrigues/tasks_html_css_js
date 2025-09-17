const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { nome, email, senha, foto } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    }

    // Validação da senha
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,}$/;
    if (!senhaRegex.test(senha)) {
      return res.status(400).json({
        error:
          "A senha deve ter no mínimo 8 caracteres, incluindo letra, número e símbolo.",
      });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = new User({
      nome,
      email,
      senha: hashedPassword,
      foto: foto || "", // base64 da foto
    });

    await newUser.save();

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};


// exports.login = async (req, res) => {
//   try {
//     const { email, senha } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

//     const validPassword = await bcrypt.compare(senha, user.senha);
//     if (!validPassword) return res.status(400).json({ error: "Senha incorreta" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.json({ token, nome: user.nome });
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao autenticar" });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) return res.status(400).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      nome: user.nome,
      foto: user.foto || null
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao autenticar" });
  }
};