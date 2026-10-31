const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
const USERS_URL = "https://jsonplaceholder.typicode.com/users";

// El modo demo solo permite generar capturas cuando no hay conexión externa.
// La aplicación normal utiliza directamente los endpoints oficiales.
const DEMO = new URLSearchParams(location.search).get("demo") === "1";

const demoUsers = [
  {id:1,name:"Leanne Graham",username:"Bret",email:"Sincere@april.biz",phone:"1-770-736-8031 x56442",website:"hildegard.org"},
  {id:2,name:"Ervin Howell",username:"Antonette",email:"Shanna@melissa.tv",phone:"010-692-6593",website:"anastasia.net"},
  {id:3,name:"Clementine Bauch",username:"Samantha",email:"Nathan@yesenia.net",phone:"1-463-123-4447",website:"ramiro.info"}
];
const demoPosts = [
  {id:1,userId:1,title:"una publicación de ejemplo",body:"Este texto representa el contenido de una publicación cargada desde JSONPlaceholder."},
  {id:2,userId:2,title:"segunda publicación",body:"Al hacer clic sobre la tarjeta se abre la ventana flotante con los datos del usuario."},
  {id:3,userId:3,title:"consulta de información",body:"Los datos mostrados en el modal corresponden al usuario relacionado con el post."}
];

const postsContainer = document.getElementById("postsContainer");
const status = document.getElementById("status");
const modal = document.getElementById("userModal");
const closeModal = document.getElementById("closeModal");
const userDetails = document.getElementById("userDetails");
const modalTitle = document.getElementById("modalTitle");
const avatar = document.getElementById("avatar");

async function loadData() {
  try {
    let posts, users;
    if (DEMO) {
      posts = demoPosts;
      users = demoUsers;
    } else {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(POSTS_URL),
        fetch(USERS_URL)
      ]);
      if (!postsResponse.ok || !usersResponse.ok) throw new Error("No se pudo consultar la API.");
      posts = await postsResponse.json();
      users = await usersResponse.json();
    }

    const usersById = Object.fromEntries(users.map(user => [user.id, user]));
    renderPosts(posts.slice(0, 12), usersById);
    status.textContent = `${posts.slice(0, 12).length} publicaciones cargadas. Selecciona una tarjeta.`;
  } catch (error) {
    status.textContent = "No fue posible cargar los datos. Verifica tu conexión a Internet.";
    console.error(error);
  }
}

function renderPosts(posts, usersById) {
  postsContainer.innerHTML = "";
  posts.forEach(post => {
    const user = usersById[post.userId];
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="card-top">
        <span class="post-id">POST #${post.id}</span>
        <span class="hint">Ver usuario →</span>
      </div>
      <h3>${escapeHTML(post.title)}</h3>
      <p>${escapeHTML(post.body)}</p>
      <div class="user-line">
        <span class="small-avatar">${user ? user.name.charAt(0) : "U"}</span>
        <span>${user ? escapeHTML(user.name) : "Usuario no encontrado"}</span>
      </div>
    `;
    card.addEventListener("click", () => user && openModal(user));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); user && openModal(user); }
    });
    postsContainer.appendChild(card);
  });
}

function openModal(user) {
  modalTitle.textContent = user.name;
  avatar.textContent = user.name.charAt(0).toUpperCase();
  userDetails.innerHTML = `
    ${detail("ID", user.id)}
    ${detail("Nombre", user.name)}
    ${detail("Username", user.username)}
    ${detail("Email", `<a href="mailto:${escapeAttr(user.email)}">${escapeHTML(user.email)}</a>`)}
    ${detail("Teléfono", user.phone)}
    ${detail("Website", `<a href="https://${escapeAttr(user.website)}" target="_blank" rel="noopener">${escapeHTML(user.website)}</a>`)}
  `;
  modal.classList.remove("hidden");
}

function detail(label, value) {
  return `<div class="detail"><span class="label">${label}</span><span class="value">${value}</span></div>`;
}
function closeUserModal() { modal.classList.add("hidden"); }
closeModal.addEventListener("click", closeUserModal);
modal.addEventListener("click", e => { if (e.target.dataset.close) closeUserModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeUserModal(); });

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}
function escapeAttr(value) { return escapeHTML(value); }

loadData();
