document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("usuarioCadastro").value.trim();
  const email = document.getElementById("emailCadastro").value.trim();
  const senha = document.getElementById("senhaCadastro").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const fotoInput = document.getElementById("foto");

  // Validações básicas
  if (!nome || !email || !senha) {
    alert("Nome, email e senha são obrigatórios!");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não conferem!");
    return;
  }

  // 🔒 Validação da senha (mínimo 8 caracteres, 1 letra, 1 número e 1 símbolo)
  const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,}$/;
  if (!senhaRegex.test(senha)) {
    alert("A senha deve ter no mínimo 8 caracteres, incluindo letra, número e símbolo.");
    return;
  }

  let foto = "";

  if (fotoInput.files.length > 0) {
    const file = fotoInput.files[0];

    // Limitar tamanho do arquivo (ex.: 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("A foto deve ter no máximo 2MB.");
      return;
    }

    try {
      foto = await toBase64(file);
    } catch (err) {
      console.error(err);
      alert("Erro ao ler a foto");
      return;
    }
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

// Função para converter arquivo para base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    // 🔎 Verifica tipo de arquivo antes de converter
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Formato de imagem não suportado. Use JPG, PNG ou GIF.");
      return reject(new Error("Formato de imagem inválido"));
    }

    // 🔎 Verifica tamanho do arquivo (até 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("A foto deve ter no máximo 2MB.");
      return reject(new Error("Arquivo muito grande"));
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (!reader.result) {
        alert("Erro ao carregar a imagem. Tente novamente.");
        reject(new Error("Falha ao converter imagem"));
      } else {
        resolve(reader.result);
      }
    };

    reader.onerror = () => {
      alert("Erro ao ler a imagem. Verifique o arquivo e tente novamente.");
      reject(reader.error);
    };

    reader.readAsDataURL(file);
  });
}



// document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const form = e.target;
//     const formData = new FormData(form); // pega todos os campos + arquivo

//     try {
//         const res = await fetch("http://localhost:4000/auth/register", {
//             method: "POST",
//             body: formData
//         });

//         const data = await res.json();
//         if (res.ok) {
//             alert(data.message);
//             window.location.href = "index.html";
//         } else {
//             alert(data.error || "Erro no cadastro");
//         }
//     } catch (err) {
//         console.error(err);
//         alert("Erro ao conectar com o servidor");
//     }
// });
