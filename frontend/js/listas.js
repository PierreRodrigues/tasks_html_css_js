document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html"; // redireciona para login se não tiver token
    return;
  }

  // --- USUÁRIO ---
  const user = JSON.parse(localStorage.getItem("user")); // { nome, foto, email }

  // elementos do card
  const avatar = document.getElementById("user-avatar");
  const cardFoto = document.getElementById("profile-foto");
  const cardNome = document.getElementById("profile-nome");
  const cardEmail = document.getElementById("profile-email");

  if (avatar && user?.foto) avatar.src = user.foto; // avatar na navbar
  if (cardFoto && user?.foto) cardFoto.src = user.foto; // foto no card
  if (cardNome) cardNome.textContent = user?.nome || "Usuário";
  if (cardEmail) cardEmail.textContent = user?.email || "Email não informado";

  // botão de logout
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.onclick = () => {
      localStorage.clear();
      window.location.href = "index.html";
    };
  }
});

const token = localStorage.getItem("token");
const listaAbas = document.getElementById("lista-abas");
const tarefasContainer = document.getElementById("tarefas-container");
const nomeLista = document.getElementById("nome-lista");
const cardsContainer = document.getElementById("cards-tarefas");

const btnNovaLista = document.getElementById("btn-nova-lista");
const formNovaLista = document.getElementById("form-nova-lista");
const inputNovaLista = document.getElementById("nome-nova-lista");
const btnCancelarNovaLista = document.getElementById("cancelar-nova-lista");

const btnNovaTarefa = document.getElementById("btn-nova-tarefa");
const formNovaTarefa = document.getElementById("form-nova-tarefa");
const descricaoInput = document.getElementById("descricao-tarefa");
const statusInput = document.getElementById("status-tarefa");
const prioridadeInput = document.getElementById("prioridade-tarefa");
const btnCancelarNovaTarefa = document.getElementById("cancelar-nova-tarefa");

let listas = [];
let tarefas = {};
let listaAtual = null;
let tarefaEditando = null;

const modalEdicao = new bootstrap.Modal(document.getElementById("modalEdicao"));
const editDescricao = document.getElementById("edit-descricao");
const editStatus = document.getElementById("edit-status");
const editPrioridade = document.getElementById("edit-prioridade");
const formEdicaoTarefa = document.getElementById("form-edicao-tarefa");

document.getElementById("btnLogout").onclick = () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
};

async function carregarListas() {
  try {
    const res = await fetch("http://localhost:4000/lists", {
      headers: { Authorization: "Bearer " + token },
    });
    listas = await res.json();
    listas.forEach(criarAba);
  } catch (err) {
    console.error(err);
  }
}

function criarAba(lista) {
  const btn = document.createElement("button");
  btn.className = "tab-button";
  btn.textContent = lista.nome;
  btn.onclick = () => mostrarTarefas(lista);
  listaAbas.appendChild(btn);
}

async function mostrarTarefas(lista) {
  listaAtual = lista;
  tarefasContainer.style.display = "block";
  nomeLista.textContent = lista.nome;

  document
    .querySelectorAll(".tab-button")
    .forEach((btn) => btn.classList.remove("active"));
  Array.from(listaAbas.children).forEach((btn) => {
    if (btn.textContent === lista.nome) btn.classList.add("active");
  });

  try {
    const res = await fetch(
      `http://localhost:4000/tasks?listaId=${lista._id}`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    const listaTarefas = await res.json();
    tarefas[lista._id] = listaTarefas || [];
    renderTarefas();
  } catch (err) {
    console.error(err);
    tarefas[lista._id] = [];
    renderTarefas();
  }
}

function renderTarefas() {
  cardsContainer.innerHTML = "";
  if (!listaAtual || !tarefas[listaAtual._id]) return;

  // cores suaves para status e prioridade
  const coresStatus = {
    iniciada: "#6c757d",
    concluída: "#198754",
    cancelada: "#dc3545",
  };
  const coresPrioridade = {
    baixa: "#adb5bd",
    média: "#ffc107",
    alta: "#fd7e14",
    urgente: "#6f42c1",
  };

  tarefas[listaAtual._id].forEach((tarefa) => {
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
            <span style="
              background-color: ${coresStatus[tarefa.status] || "#6c757d"};
              color: white;
              padding: 3px 10px;
              border-radius: 8px;
              font-size: 0.85rem;
            ">
              ${tarefa.status}
            </span>
            <span style="
              background-color: ${
                coresPrioridade[tarefa.prioridade || "média"] || "#ffc107"
              };
              color: white;
              padding: 3px 10px;
              border-radius: 8px;
              font-size: 0.85rem;
            ">
              ${tarefa.prioridade || "média"}
            </span>
          </div>
          <p class="text-muted mb-1"><small>Lista: ${
            listaAtual.nome
          }</small></p>
          <p class="text-muted mb-0 mt-auto"><small>Criada em: ${new Date(
            tarefa.createdAt
          ).toLocaleDateString("pt-BR")}</small></p>
        </div>
      </div>
    `;

    col.querySelector(".card").onclick = () => abrirModalEdicao(tarefa);
    cardsContainer.appendChild(col);
  });
}

function abrirModalEdicao(tarefa) {
  tarefaEditando = tarefa;
  editDescricao.value = tarefa.descricao;
  editStatus.value = tarefa.status;
  editPrioridade.value = tarefa.prioridade || "média";
  modalEdicao.show();
}

formEdicaoTarefa.onsubmit = async (e) => {
  e.preventDefault();
  if (!tarefaEditando) return;
  try {
    await fetch(`http://localhost:4000/tasks/${tarefaEditando._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descricao: editDescricao.value,
        status: editStatus.value,
        prioridade: editPrioridade.value,
      }),
    });
    modalEdicao.hide();
    mostrarTarefas(listaAtual);
  } catch (err) {
    console.error(err);
  }
};

btnNovaLista.onclick = () => (formNovaLista.style.display = "block");
btnCancelarNovaLista.onclick = () => (formNovaLista.style.display = "none");

formNovaLista.onsubmit = async (e) => {
  e.preventDefault();
  const nome = inputNovaLista.value.trim();
  if (!nome) return;
  try {
    const res = await fetch("http://localhost:4000/lists", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome }),
    });
    const novaLista = await res.json();
    listas.push(novaLista);
    tarefas[novaLista._id] = [];
    criarAba(novaLista);
    mostrarTarefas(novaLista);
    inputNovaLista.value = "";
    formNovaLista.style.display = "none";
  } catch (err) {
    console.error(err);
  }
};

btnNovaTarefa.onclick = () => (formNovaTarefa.style.display = "block");

formNovaTarefa.onsubmit = async (e) => {
  e.preventDefault();
  const descricao = descricaoInput.value.trim();
  const status = statusInput.value;
  const prioridade = prioridadeInput.value;
  if (!descricao) return;
  try {
    await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descricao,
        status,
        prioridade,
        listaId: listaAtual._id,
      }),
    });
    descricaoInput.value = "";
    formNovaTarefa.style.display = "none";
    mostrarTarefas(listaAtual);
  } catch (err) {
    console.error(err);
  }
};

btnCancelarNovaTarefa.onclick = () => {
  formNovaTarefa.style.display = "none";
  descricaoInput.value = "";
  statusInput.value = "iniciada";
  prioridadeInput.value = "média";
};

const btnExcluirTarefa = document.getElementById("btn-excluir-tarefa");

btnExcluirTarefa.onclick = async () => {
  if (!tarefaEditando) return;

  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

  try {
    await fetch(`http://localhost:4000/tasks/${tarefaEditando._id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    modalEdicao.hide();
    mostrarTarefas(listaAtual); // recarrega os cards
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir a tarefa.");
  }
};

carregarListas();
