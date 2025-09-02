document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  const nome = localStorage.getItem("nome");

  if (!token) {
    alert("Você precisa estar logado!");
    window.location.href = "index.html";
    return;
  }

  document.querySelector("h2").textContent = `Bem-vindo, ${nome}`;

  try {
    const res = await fetch("http://localhost:4000/tasks/last", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Erro HTTP: " + res.status);
    const ultimasTarefas = await res.json();

    const listaTarefas = document.getElementById("ultimas-tarefas");
    listaTarefas.innerHTML = "";
    ultimasTarefas.forEach((tarefa) => {
      const li = document.createElement("li");
      li.textContent = tarefa.descricao;
      listaTarefas.appendChild(li);
    });

    const resStats = await fetch("http://localhost:4000/stats", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    if (!resStats.ok) throw new Error("Erro HTTP: " + resStats.status);
    const stats = await resStats.json();

    desenharGrafico(stats);
    desenharCards(stats)
  } catch (err) {
    console.error("Erro ao carregar tarefas:", err);
  }
});



function desenharGrafico(stats) {
  const canvas = document.getElementById("graficoTarefas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  // Ajusta tamanho real do canvas
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr); // escala o contexto

  ctx.clearRect(0, 0, width, height);

  const labels = Object.keys(stats);
  const valores = Object.values(stats);

  const larguraBarra = 40;
  const espacamento = 20;
  const alturaMax = Math.max(...valores);
  const escala = (height - 60) / (alturaMax || 1);

  const cores = {
    iniciada: "#0d6efd",
    cancelada: "#dc3545",
    concluída: "#198754",
  };

  labels.forEach((label, i) => {
    const x = i * (larguraBarra + espacamento) + 50;
    const y = height - valores[i] * escala - 20;

    ctx.fillStyle = cores[label] || "#6c757d";
    ctx.fillRect(x, y, larguraBarra, valores[i] * escala);

    ctx.fillStyle = "#000";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(valores[i], x + larguraBarra / 2, y - 5);

    ctx.fillText(label, x + larguraBarra / 2, height - 5);
  });
}

function carregarUsuario() {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = localStorage.getItem("email"); // se você também salvar o email no login

  if (!user) {
    console.warn("Nenhum usuário logado.");
    return;
  }

  // Atualiza avatar na navbar
  const avatar = document.getElementById("user-avatar");
  if (avatar && user.foto) {
    avatar.src = user.foto;
  }

  // Atualiza informações no card de perfil
  const cardFoto = document.getElementById("profile-foto");
  const cardNome = document.getElementById("profile-nome");
  const cardEmail = document.getElementById("profile-email");

  if (cardFoto && user.foto) cardFoto.src = user.foto;
  if (cardNome) cardNome.textContent = user.nome || "Usuário";
  if (cardEmail) cardEmail.textContent = email || "Email não informado";

  document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html"; // volta para login
  });
}

// Executa ao carregar a home
document.addEventListener("DOMContentLoaded", carregarUsuario);


function desenharCards(stats) {
  const container = document.getElementById("grafico-container");
  if (!container) return;

  // limpa conteúdo anterior
  container.innerHTML = "";

  // cria a linha de cards
  const row = document.createElement("div");
  row.className = "row g-4";

  const cores = {
    iniciada: "primary",
    cancelada: "danger",
    concluída: "success",
  };

  Object.entries(stats).forEach(([status, valor]) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card text-white bg-${cores[status] || "secondary"} mb-3">
        <div class="card-body">
          <h5 class="card-title text-capitalize">${status}</h5>
          <p class="card-text">${valor} tarefa${valor !== 1 ? "s" : ""}</p>
        </div>
      </div>
    `;
    row.appendChild(col);
  });

  container.appendChild(row);
}




