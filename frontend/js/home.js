document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  // --- USUÁRIO ---
  const user = JSON.parse(localStorage.getItem("user")); // { nome, foto, email }
  const bemVindo = document.querySelector("h2");
  if (bemVindo && user) bemVindo.textContent = `Bem-vindo, ${user.nome}`;

  const avatar = document.getElementById("user-avatar");
  const cardFoto = document.getElementById("profile-foto");
  const cardNome = document.getElementById("profile-nome");
  const cardEmail = document.getElementById("profile-email");

  if (avatar && user?.foto) avatar.src = user.foto;
  if (cardFoto && user?.foto) cardFoto.src = user.foto;
  if (cardNome) cardNome.textContent = user?.nome || "Usuário";
  if (cardEmail) cardEmail.textContent = user?.email || "Email não informado";

  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.onclick = () => {
      localStorage.clear();
      window.location.href = "/login.html";
    };
  }

  try {
    await carregarTarefas(token);
    await carregarStats(token);
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
  }
});

let tarefaAtual = null;

// --- FUNÇÃO PARA CARREGAR ÚLTIMAS TAREFAS ---
async function carregarTarefas(token) {
  const res = await fetch("http://localhost:4000/tasks/last", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao buscar tarefas");
  const tarefas = await res.json();

  const listaTarefas = document.getElementById("ultimas-tarefas");
  listaTarefas.innerHTML = "";

  const row = document.createElement("div");
  row.className = "row g-3";

  const coresStatus = { iniciada: "primary", cancelada: "danger", concluída: "success" };
  const coresPrioridade = { baixa: "secondary", média: "warning", alta: "danger", urgente: "dark" };

  tarefas.forEach((tarefa) => {
    // corrige o _id se vier como { $oid: ... }
    const id = tarefa._id.$oid || tarefa._id;

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.setAttribute("data-id", id);

    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-2">${tarefa.descricao}</h5>
          <p class="mb-1">
            <span class="badge badge-status bg-${coresStatus[tarefa.status] || "secondary"}">
              ${tarefa.status}
            </span>
            <span class="badge badge-prioridade bg-${
              coresPrioridade[tarefa.prioridade || "média"]
            } ms-1">
              ${tarefa.prioridade || "média"}
            </span>
          </p>
          <p class="text-muted mb-1">
            <small>Lista: ${tarefa.listaNome || "Sem lista"}</small>
          </p>
          <p class="text-muted mb-0 mt-auto">
            <small>Criada em: ${new Date(tarefa.createdAt).toLocaleDateString("pt-BR")}</small>
          </p>
        </div>
      </div>
    `;

    col.querySelector(".card").onclick = () => abrirModal(tarefa);
    row.appendChild(col);
  });

  listaTarefas.appendChild(row);
}

// --- FUNÇÃO PARA CARREGAR CARDS DE STATUS ---
async function carregarStats(token) {
  const res = await fetch("http://localhost:4000/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao buscar stats");
  const stats = await res.json();

  const coresStatus = { iniciada: "primary", cancelada: "danger", concluída: "success" };
  const container = document.getElementById("grafico-container");
  if (!container) return;
  container.innerHTML = "";

  const row = document.createElement("div");
  row.className = "row g-4";

  Object.entries(stats).forEach(([status, valor]) => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card text-white bg-${coresStatus[status] || "secondary"} mb-3">
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

// --- MODAL ---
function abrirModal(tarefa) {
  tarefaAtual = tarefa;
  const modal = document.getElementById("modal-edicao");
  modal.style.display = "flex";

  document.getElementById("modal-descricao").value = tarefa.descricao;
  document.getElementById("modal-status").value = tarefa.status;
  document.getElementById("modal-prioridade").value = tarefa.prioridade || "média";
}

// fechar modal
document.getElementById("modal-close").onclick = () => {
  document.getElementById("modal-edicao").style.display = "none";
};

// salvar alterações
document.getElementById("modal-save").onclick = async () => {
  if (!tarefaAtual) return;
  const descricao = document.getElementById("modal-descricao").value;
  const status = document.getElementById("modal-status").value;
  const prioridade = document.getElementById("modal-prioridade").value;
  const token = localStorage.getItem("token");

  // corrige id do Mongo
  const id = tarefaAtual._id.$oid || tarefaAtual._id;

  try {
    // const id = tarefaAtual._id.$oid || tarefaAtual._id;
    console.log(id)
    const res = await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ descricao, status, prioridade }),
    });

    if (!res.ok) throw new Error("Erro ao atualizar");

    const atualizado = await res.json();
    tarefaAtual.descricao = atualizado.descricao;
    tarefaAtual.status = atualizado.status;
    tarefaAtual.prioridade = atualizado.prioridade;

    atualizarCard(tarefaAtual);
    // 🔄 Atualiza os cards de stats
    await carregarStats(token);

    document.getElementById("modal-edicao").style.display = "none";
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    alert("Erro ao atualizar tarefa");
  }
};

function atualizarCard(tarefa) {
  const id = tarefa._id.$oid || tarefa._id;
  const col = document.querySelector(`[data-id='${id}']`);
  if (!col) return;

  const card = col.querySelector(".card");
  card.querySelector(".card-title").textContent = tarefa.descricao;

  const statusBadge = card.querySelector(".badge-status");
  statusBadge.textContent = tarefa.status;
  statusBadge.className = `badge badge-status bg-${{
    iniciada: "primary",
    cancelada: "danger",
    concluída: "success",
  }[tarefa.status] || "secondary"}`;

  const prioridadeBadge = card.querySelector(".badge-prioridade");
  prioridadeBadge.textContent = tarefa.prioridade || "média";
  prioridadeBadge.className = `badge badge-prioridade bg-${
    {
      baixa: "secondary",
      média: "warning",
      alta: "danger",
      urgente: "dark",
    }[tarefa.prioridade || "média"]
  } ms-1`;
}
