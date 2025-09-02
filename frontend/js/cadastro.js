document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("usuarioCadastro").value.trim();
    const email = document.getElementById("emailCadastro").value.trim();
    const senha = document.getElementById("senhaCadastro").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const fotoInput = document.getElementById("foto");

    if (senha !== confirmarSenha) {
        alert("As senhas não conferem!");
        return;
    }

    if (!nome || !email || !senha) {
        alert("Nome, email e senha são obrigatórios!");
        return;
    }

    let foto = "";
    if (fotoInput.files.length > 0) {
        const file = fotoInput.files[0];
        foto = await toBase64(file);
    }

    const body = { nome, email, senha, foto };

    try {
        const res = await fetch("http://localhost:4000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            window.location.href = "index.html"; // redireciona para login
        } else {
            alert(data.error || "Erro no cadastro");
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor");
    }
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = err => reject(err);
    });
}
