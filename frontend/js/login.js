document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.nome);
      localStorage.setItem("email", email); // <- salvar email também
      localStorage.setItem(
        "user",
        JSON.stringify({
          nome: data.nome,
          foto: data.foto,
        })
      );
      alert(`Bem-vindo, ${data.nome}!`);
      window.location.href = "home.html";
    } else {
      alert(data.error || "Erro ao logar");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o servidor");
  }
});
