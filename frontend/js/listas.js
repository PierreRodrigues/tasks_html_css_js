document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado!");
    window.location.href = "index.html";
    return;
  }

  const listaAbas = document.getElementById("lista-abas");
  const tarefasContainer = document.getElementById("tarefas-container");
  const tarefasLista = document.getElementById("tarefas-lista");
  const nomeListaHeader = document.getElementById("nome-lista");

  let listas = [];
  let tarefas = [];

  // Busca listas
  async function carregarListas() {
    try {
      const res = await fetch("http://localhost:4000/lists", {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) throw new Error("Erro ao carregar listas");
      listas = await res.json();
      mostrarListas();
    } catch (err) {
      console.error("Erro ao carregar listas:", err);
    }
  }

  // Mostra abas
  function mostrarListas() {
    listaAbas.innerHTML = "";
    listas.forEach(lista => {
      const btn = document.createElement("button");
      btn.textContent = lista.nome;
      btn.className = "tab-button";
      btn.onclick = () => mostrarTarefas(lista);
      listaAbas.appendChild(btn);
    });
  }

  // Busca e mostra tarefas de uma lista
  async function mostrarTarefas(lista) {
    try {
      const res = await fetch(`http://localhost:4000/tasks?listaId=${lista._id}`, {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) throw new Error("Erro ao carregar tarefas da lista");
      tarefas = await res.json();

      nomeListaHeader.textContent = lista.nome;
      tarefasLista.innerHTML = "";

      tarefas.forEach(tarefa => {
        const li = document.createElement("li");
        li.className = "tarefa-item"; // flex container

        const desc = document.createElement("span");
        desc.textContent = tarefa.descricao;
        desc.className = `status-${tarefa.status}`;

        const listaSpan = document.createElement("span");
        listaSpan.textContent = tarefa.listaNome || "Sem lista";

        const icones = document.createElement("div");
        icones.className = "icone-container";
        icones.innerHTML = `
          <i class="bi bi-pencil-square" title="Editar"></i>
          <i class="bi bi-trash" title="Remover"></i>
        `;

        li.appendChild(desc);
        li.appendChild(listaSpan);
        li.appendChild(icones);

        tarefasLista.appendChild(li);
      });

      atualizarCorAba(lista._id);
      tarefasContainer.style.display = "block";
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
    }
  }

  // Atualiza cor da aba baseado no status
  function atualizarCorAba(listaId) {
    const buttons = listaAbas.querySelectorAll("button");
    buttons.forEach(btn => btn.classList.remove("active"));

    const lista = listas.find(l => l._id === listaId);
    const btn = Array.from(buttons).find(b => b.textContent === lista.nome);
    if (!btn) return;

    const tarefasDaLista = tarefas.filter(t => t.listaId && t.listaId._id === lista._id);
    let cor = "blue";
    if (tarefasDaLista.every(t => t.status === "concluída")) cor = "green";
    else if (tarefasDaLista.every(t => t.status === "cancelada")) cor = "red";

    btn.style.backgroundColor = cor;
    btn.classList.add("active");
  }

  carregarListas();
});
