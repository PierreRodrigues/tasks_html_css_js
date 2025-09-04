// const btnLogout = document.getElementById("btn-logout");
//         btnLogout.onclick = () => {
//           localStorage.removeItem("token");
//           localStorage.removeItem("nome");
//           window.location.href = "index.html";
//         };

document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("user-avatar");

  // pega o usuário do localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.foto) {
    avatar.src = user.foto;
  } else {
    // fallback: ícone genérico
    avatar.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  }
});
