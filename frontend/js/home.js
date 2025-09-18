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
  const listaTarefas = document.getElementById("ultimas-tarefas");
  listaTarefas.innerHTML = `
    <div class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
  `;

  try {
    const res = await fetch("http://localhost:4000/tasks/last", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao buscar tarefas");
    const tarefas = await res.json();

    listaTarefas.innerHTML = "";
    const row = document.createElement("div");
    row.className = "row g-3";

    tarefas.forEach((tarefa) => {
      const id = tarefa._id?.$oid || tarefa._id;
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      col.setAttribute("data-id", id);
      col.innerHTML = `
        <div class="card card-custom h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-2">${tarefa.descricao}</h5>
            <div class="mb-2 d-flex gap-2 flex-wrap">
              <span class="badge-status status-${tarefa.status}">
                ${tarefa.status}
              </span>
              <span class="badge-prioridade prioridade-${tarefa.prioridade || "média"}">
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
  } catch (error) {
    listaTarefas.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Erro ao carregar tarefas
      </div>
    `;
  }
}
// --- FUNÇÃO PARA CARREGAR CARDS DE STATUS ---
async function carregarStats(token) {
  const container = document.getElementById("grafico-container");
  if (!container) return;
  container.innerHTML = `
    <div class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
  `;

  try {
    const res = await fetch("http://localhost:4000/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao buscar stats");
    const { total, statusStats, prioridadeStats } = await res.json();

    container.innerHTML = "";

    // === CARD TOTAL ===
    const totalCard = document.createElement("div");
    totalCard.className = "mb-4 text-center";
    totalCard.innerHTML = `
      <div class="card-total">
        <h4>Total de Tarefas</h4>
        <p class="card-total-num">${total}</p>
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
      card.className = `card-stat status-${status}`;
      card.innerHTML = `
        <h6 class="text-capitalize mb-1">${status}</h6>
        <p class="card-stat-num">${valor}</p>
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
      card.className = `card-stat prioridade-${prioridade}`;
      card.innerHTML = `
        <h6 class="text-capitalize mb-1">${prioridade}</h6>
        <p class="card-stat-num">${valor}</p>
      `;
      rowPrioridade.appendChild(card);
    });
    container.appendChild(rowPrioridade);
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Erro ao carregar estatísticas
      </div>
    `;
  }
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

  // atualizar status
  const statusBadge = card.querySelector(".badge-status");
  if (statusBadge) {
    statusBadge.textContent = tarefa.status;

    // remove classes antigas de status
    statusBadge.className = "badge-status"; 
    if (tarefa.status) {
      statusBadge.classList.add(`status-${tarefa.status}`);
    }
  }

  // atualizar prioridade
  const prioridadeBadge = card.querySelector(".badge-prioridade");
  if (prioridadeBadge) {
    prioridadeBadge.textContent = tarefa.prioridade || "média";

    // remove classes antigas de prioridade
    prioridadeBadge.className = "badge-prioridade";
    prioridadeBadge.classList.add(
      `prioridade-${tarefa.prioridade || "média"}`
    );
  }
}
