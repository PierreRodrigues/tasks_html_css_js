document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado!");
    window.location.href = "index.html";
    return;
  }

  const menuToggle = document.getElementById("menu-toggle");
  const drawer = document.getElementById("drawer");
  menuToggle.onclick = () => drawer.classList.toggle("show");

  document.getElementById("btn-logout").onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    window.location.href = "index.html";
  };
  document.getElementById("drawer-logout").onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    window.location.href = "index.html";
  };

  const tbody = document.getElementById("tabela-tarefas");

  try {
    const res = await fetch("http://localhost:4000/tasks", {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Erro HTTP: " + res.status);
    const tarefas = await res.json();

    tbody.innerHTML = "";
    tarefas.forEach((tarefa) => {
      const tr = document.createElement("tr");

      const tdDesc = document.createElement("td");
      tdDesc.textContent = tarefa.descricao;

      const tdStatus = document.createElement("td");
      tdStatus.textContent = tarefa.status;
      tdStatus.className = "status-" + tarefa.status;

      const tdLista = document.createElement("td");
      // tdLista.textContent = tarefa.listaId?.nome || "Sem lista";
      tdLista.textContent = tarefa.listaNome;

      tr.appendChild(tdDesc);
      tr.appendChild(tdStatus);
      tr.appendChild(tdLista);

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar tarefas:", err);
  }
});
