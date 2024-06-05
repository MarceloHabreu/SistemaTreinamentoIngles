const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");

openSidebar.addEventListener("click", () => {
  sidebar.style.left = "0";
});

closeSidebar.addEventListener("click", () => {
  sidebar.style.left = "-100%";
});

/* Icone de informação */
const infoIcon = document.getElementById("infoIcon");
const infoModal = document.getElementById("infoModal");
const closeModal = document.getElementById("closeModal");
const closeModalCadastro = document.getElementById("closeModalCadastro");
const closeModalLogin = document.getElementById("closeModalLogin")

// Abre o modal quando o ícone é clicado
infoIcon.addEventListener("click", () => {
  infoModal.style.display = "block";
});

// Fecha o modal quando o X é clicado
closeModal.addEventListener("click", () => {
  infoModal.style.display = "none";
});
closeModalCadastro.addEventListener("click", () => {
  document.getElementById("registroForm").style.display = "none";
});
 closeModalLogin.addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "none";
});

/* Cliques botões de Login e Cadastro */
document.getElementById("btnLogin").onclick = function () {
  document.getElementById("loginForm").style.display = "block";
};

document.getElementById("btnRegistro").onclick = function () {
  document.getElementById("registroForm").style.display = "block";
};

/* Cuidando da API da Home */
document.addEventListener("DOMContentLoaded", function () {
  const newsFeed = document.getElementById("newsFeed");
  const apiKey = "l10wVDuk4FAyFaBFzjAsIlmwlAS56hLs"; //chave da api do the new york times
  const url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.results) {
        throw new Error("Invalid API response");
      }
      const articles = data.results.slice(0, 8) || []; // Mostra os últimos 8 artigos
      let newsHTML = "";

      articles.forEach((article) => {
        newsHTML += `
        <div class="news-card">
          <img src="${
            article.multimedia && article.multimedia.length > 0
              ? article.multimedia[0].url
              : "./imgs/imgPadrão.jpg"
          }" alt="News Image">
          <div class="news-card-content">
            <h2>${article.title}</h2>
            <p>${article.abstract || ""}</p>
            <a href="${article.url}" target="_blank">Read more</a>
          </div>
        </div>
      `;
      });

      newsFeed.innerHTML = newsHTML;
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      newsFeed.innerHTML =
        "<p>Sorry, we are unable to fetch news at the moment.</p>";
    });
});

window.onclick = function (event) {
  if (event.target == document.getElementById("loginForm")) {
    document.getElementById("loginForm").style.display = "none";
  }
  if (event.target == document.getElementById("registroForm")) {
    document.getElementById("registroForm").style.display = "none";
  }
  if (event.target == document.getElementById("infoModal")) {
    document.getElementById("infoModal").style.display = "none";
  }
};
