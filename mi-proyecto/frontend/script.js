const API = "http://localhost:3000/api";

// ─── Auth helpers ────────────────────────────────────────────────────────────
function getUserId() { return localStorage.getItem("userId"); }
function setUserId(id) { localStorage.setItem("userId", id); }
function logout() { localStorage.removeItem("userId"); window.location.href = "index.html"; }

// Redirect to notes if already logged in
if (document.getElementById("loginForm") && getUserId()) {
  window.location.href = "notes.html";
}
// Redirect to login if not logged in
if (document.getElementById("notesList") && !getUserId()) {
  window.location.href = "index.html";
}

// ─── Tab switching ───────────────────────────────────────────────────────────
function showTab(tab) {
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("registerForm").classList.toggle("hidden", tab !== "register");
  document.querySelectorAll(".tab").forEach((t, i) => {
    t.classList.toggle("active", (i === 0 && tab === "login") || (i === 1 && tab === "register"));
  });
}

// ─── Register ────────────────────────────────────────────────────────────────
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("registerMsg");
    const body = {
      email: document.getElementById("regEmail").value.trim(),
      password: document.getElementById("regPassword").value,
      confirmPassword: document.getElementById("regConfirm").value,
    };
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      msg.className = res.ok ? "msg success" : "msg error";
      msg.textContent = data.message || data.error;
      if (res.ok) setTimeout(() => showTab("login"), 1000);
    } catch {
      msg.className = "msg error";
      msg.textContent = "Server error. Try again.";
    }
  });
}

// ─── Login ───────────────────────────────────────────────────────────────────
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("loginMsg");
    const body = {
      email: document.getElementById("loginEmail").value.trim(),
      password: document.getElementById("loginPassword").value,
    };
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setUserId(data.userId);
        window.location.href = "notes.html";
      } else {
        msg.className = "msg error";
        msg.textContent = data.error;
      }
    } catch {
      msg.className = "msg error";
      msg.textContent = "Server error. Try again.";
    }
  });
}

// ─── Notes ───────────────────────────────────────────────────────────────────
async function loadNotes() {
  const list = document.getElementById("notesList");
  if (!list) return;
  try {
    const res = await fetch(`${API}/notes`, {
      headers: { "x-user-id": getUserId() },
    });
    const notes = await res.json();
    if (!notes.length) {
      list.innerHTML = "<p style='color:#aaa;text-align:center'>No notes yet.</p>";
      return;
    }
    list.innerHTML = notes.map(n => `
      <div class="note-card" id="note-${n.id}">
        <h3>${escHtml(n.title)}</h3>
        <p>${escHtml(n.content)}</p>
        <div class="meta">Updated: ${new Date(n.updated_at).toLocaleString()}</div>
        <div class="note-actions">
          <button class="btn-edit" onclick="editNote('${n.id}', this)">Edit</button>
          <button class="btn-delete" onclick="deleteNote('${n.id}')">Delete</button>
        </div>
      </div>
    `).join("");
  } catch {
    list.innerHTML = "<p class='msg error'>Failed to load notes.</p>";
  }
}

async function createNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();
  const msg = document.getElementById("noteMsg");
  try {
    const res = await fetch(`${API}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": getUserId() },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById("noteTitle").value = "";
      document.getElementById("noteContent").value = "";
      msg.className = "msg success";
      msg.textContent = "Note saved!";
      loadNotes();
    } else {
      msg.className = "msg error";
      msg.textContent = data.error;
    }
  } catch {
    msg.className = "msg error";
    msg.textContent = "Server error.";
  }
}

async function deleteNote(id) {
  if (!confirm("Delete this note?")) return;
  await fetch(`${API}/notes/${id}`, {
    method: "DELETE",
    headers: { "x-user-id": getUserId() },
  });
  loadNotes();
}

function editNote(id, btn) {
  const card = document.getElementById(`note-${id}`);
  const title = card.querySelector("h3").textContent;
  const content = card.querySelector("p").textContent;

  card.innerHTML = `
    <input type="text" id="edit-title-${id}" value="${escAttr(title)}" maxlength="100" />
    <textarea id="edit-content-${id}" maxlength="5000">${escHtml(content)}</textarea>
    <div class="note-actions">
      <button class="btn-edit" onclick="saveEdit('${id}')">Save</button>
      <button class="btn-delete" onclick="loadNotes()">Cancel</button>
    </div>
  `;
}

async function saveEdit(id) {
  const title = document.getElementById(`edit-title-${id}`).value.trim();
  const content = document.getElementById(`edit-content-${id}`).value.trim();
  await fetch(`${API}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-user-id": getUserId() },
    body: JSON.stringify({ title, content }),
  });
  loadNotes();
}

// ─── Utils ───────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function escAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

// Init
loadNotes();
