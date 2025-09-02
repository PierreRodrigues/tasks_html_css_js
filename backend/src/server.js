require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const listRoutes = require("./routes/listRoutes");
const statsRoutes = require("./routes/statsRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/lists", listRoutes);
app.use("/stats", statsRoutes);
app.use("/users", userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}`));
  })
  .catch(err => console.error("Erro ao conectar MongoDB", err));
