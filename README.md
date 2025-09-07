# 📋 TidyTasks - Gerenciador de Tarefas

Um sistema completo de gerenciamento de tarefas com **autenticação**, **organização por listas**, **estatísticas visuais** e **cadastro de usuários com foto**.  
Projeto dividido em **Backend (API Node.js + MongoDB)** e **Frontend (HTML, CSS, JS + Bootstrap 5)**.

---

## 🚀 Tecnologias Utilizadas

### 🔹 Backend
- **Node.js** + **Express**
- **MongoDB** com **Mongoose**
- **JWT (JSON Web Token)** para autenticação
- **Bcrypt.js** para hash de senha
- **CORS** habilitado para integração com o frontend
- Suporte a upload de imagem (armazenada como **Base64**)

### 🔹 Banco de Dados
- **MongoDB Atlas** (ou local)
- Coleções principais:
  - `users` → cadastro e login de usuários
  - `tasks` → tarefas com status, prioridade e lista
  - `lists` → organização de tarefas
  - `stats` → dados agregados para gráficos

### 🔹 Frontend
- **HTML5**, **CSS3**, **JavaScript**
- **Bootstrap 5** para UI responsiva
- **Fetch API** para consumo da API
- Controle de sessão com **LocalStorage**
- Interface com:
  - Tela de login e cadastro
  - Dashboard com tarefas recentes
  - Estatísticas por **status** e **prioridade**
  - Edição de tarefas via **modal**

---

## 📂 Estrutura do Projeto
```
📁 projeto-taskly
┣ 📁 backend
┃ ┣ 📁 routes # Rotas da API (auth, tasks, lists, stats, users)
┃ ┣ 📁 controllers # Lógica das rotas
┃ ┣ 📁 models # Schemas do MongoDB
┃ ┣ server.js # Configuração principal do servidor
┃ ┗ .env # Variáveis de ambiente (PORT, MONGO_URI, JWT_SECRET)
┣ 📁 frontend
┃ ┣ 📁 assets # Logos e imagens
┃ ┣ 📁 css # Estilos (global.css, home.css, etc)
┃ ┣ 📁 js # Scripts (global.js, home.js, login.js, cadastro.js)
┃ ┣ index.html # Tela de login
┃ ┣ cadastro.html # Tela de cadastro
┃ ┣ home.html # Dashboard principal
┃ ┗ listas.html # Página com tarefas organizadas
┗ README.md
```

---

## ⚙️ Como Rodar o Projeto

### 🔸 1. conectar ao MongoDB

### 🔸 2. Crie um arquivo .env dentro de backend/ com:

    PORT=4000
    MONGO_URI=sua_string_de_conexao_mongodb
    JWT_SECRET=umsegurosegredo

### 🔸 3. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/taskly.git
cd ada_globo_html_css_js
```
### 🔸 4. Configurar o Backend
```
cd backend
npm install
```
### 🔸 5. Inicie o servidor:
```
npm start
```
Servidor rodando em: http://localhost:4000

### 🔸 6. Rodar o Frontend

Basta abrir o arquivo frontend/index.html no navegador.
(ou servir com extensão Live Server no VSCode para facilitar).

📊 Funcionalidades

✅ Cadastro e login de usuários com foto
✅ Autenticação via JWT
✅ CRUD de tarefas (criar, listar, atualizar, excluir)
✅ Filtro por tipo de tarefa
✅ Organização em listas
✅ Dashboard com estatísticas em cards
✅ Modal de edição rápida das tarefas
✅ Logout e controle de sessão com LocalStorage

🎯 Próximos Passos (melhorias futuras)

 Filtros por status e prioridade

 Suporte a upload real de imagens (Multer) em vez de Base64

 Deploy do backend (Heroku, Render ou Railway)

 Deploy do frontend (Vercel ou Netlify)

👨‍💻 Autores

- Maria
- Beatriz
- Pierre
- Nando