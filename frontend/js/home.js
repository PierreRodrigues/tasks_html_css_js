document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
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
      window.location.href = "index.html";
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

  // cores suaves, mesmo tema dos stats
  const coresStatus = { iniciada: "#6c757d", cancelada: "#dc3545", concluída: "#198754" };
  const coresPrioridade = { baixa: "#adb5bd", média: "#ffc107", alta: "#fd7e14", urgente: "#6f42c1" };

  tarefas.forEach((tarefa) => {
    const id = tarefa._id?.$oid || tarefa._id;

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.setAttribute("data-id", id);

    col.innerHTML = `
      <div style="
        background-color: #f8f9fa;
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        height: 100%;
        cursor: pointer;
      " class="card h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-2">${tarefa.descricao}</h5>
          <div class="mb-2 d-flex gap-2 flex-wrap">
            <span class="badge-status" 
  style="background-color: ${coresStatus[tarefa.status] || "#6c757d"}; 
         color: white; 
         padding: 3px 10px; 
         border-radius: 8px; 
         font-size: 0.85rem;">
  ${tarefa.status}
</span>

<span class="badge-prioridade" 
  style="background-color: ${coresPrioridade[tarefa.prioridade || "média"] || "#ffc107"}; 
         color: white; 
         padding: 3px 10px; 
         border-radius: 8px; 
         font-size: 0.85rem;">
  ${tarefa.prioridade || "média"}
</span>
          </div>
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

  const { total, statusStats, prioridadeStats } = await res.json();

  const coresStatus = { iniciada: "#6c757d", cancelada: "#dc3545", concluída: "#198754" };
  const coresPrioridade = { baixa: "#adb5bd", média: "#ffc107", alta: "#fd7e14", urgente: "#6f42c1" };

  const container = document.getElementById("grafico-container");
  if (!container) return;
  container.innerHTML = "";

  // === CARD TOTAL ===
  const totalCard = document.createElement("div");
  totalCard.className = "mb-4 text-center";
  totalCard.innerHTML = `
    <div style="
      background-color: #f8f9fa; 
      padding: 20px; 
      border-radius: 12px; 
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    ">
      <h4>Total de Tarefas</h4>
      <p style="font-size: 2rem; font-weight: bold; margin: 0;">${total}</p>
    </div>
  `;
  container.appendChild(totalCard);

  // === STATUS ===
  const statusTitle = document.createElement("h5");
  statusTitle.textContent = "Por Status";
  statusTitle.className = "mt-4 mb-2";
  container.appendChild(statusTitle);

  const rowStatus = document.createElement("div");
  rowStatus.className = "d-flex flex-wrap gap-3 mb-4";

  Object.entries(statusStats).forEach(([status, valor]) => {
    const card = document.createElement("div");
    card.style = `
      flex: 1 1 150px; 
      background-color: ${coresStatus[status]}; 
      color: white; 
      padding: 15px; 
      border-radius: 12px; 
      text-align: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    `;
    card.innerHTML = `
      <h6 class="text-capitalize mb-1">${status}</h6>
      <p style="font-size: 1.5rem; font-weight: bold; margin: 0;">${valor}</p>
    `;
    rowStatus.appendChild(card);
  });
  container.appendChild(rowStatus);

  // === PRIORIDADES ===
  const prioridadeTitle = document.createElement("h5");
  prioridadeTitle.textContent = "Por Prioridade";
  prioridadeTitle.className = "mt-4 mb-2";
  container.appendChild(prioridadeTitle);

  const rowPrioridade = document.createElement("div");
  rowPrioridade.className = "d-flex flex-wrap gap-3 mb-4";

  Object.entries(prioridadeStats).forEach(([prioridade, valor]) => {
    const card = document.createElement("div");
    card.style = `
      flex: 1 1 150px; 
      background-color: ${coresPrioridade[prioridade]}; 
      color: white; 
      padding: 15px; 
      border-radius: 12px; 
      text-align: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    `;
    card.innerHTML = `
      <h6 class="text-capitalize mb-1">${prioridade}</h6>
      <p style="font-size: 1.5rem; font-weight: bold; margin: 0;">${valor}</p>
    `;
    rowPrioridade.appendChild(card);
  });
  container.appendChild(rowPrioridade);
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
