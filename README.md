# 📝 Private Note Manager

Aplicación web de gestión de notas privadas desarrollada en un hackathon de 12 horas. Cada usuario solo puede ver y gestionar sus propias notas.

---

## 🧱 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5 + CSS + Vanilla JS |
| Backend | Node.js + Express.js |
| Base de datos | JSON file (`backend/data/db.json`) |
| Contenedores | Docker + Docker Compose |

---

## 📁 Estructura del proyecto

```
mi-proyecto/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── app.js
│   ├── routes/
│   │   ├── auth.js        ← registro y login
│   │   └── notes.js       ← CRUD de notas
│   ├── middleware/
│   │   └── auth.js        ← protección de rutas (JWT pendiente)
│   ├── data/
│   │   └── db.json        ← usuarios y notas
│   └── utils/
│       └── db.js          ← helpers de lectura/escritura
└── frontend/
    ├── index.html         ← login y registro
    ├── notes.html         ← dashboard de notas
    ├── style.css
    └── script.js
```

---

## 🚀 Cómo arrancar el proyecto

### Con Docker (recomendado)

```bash
docker-compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3000

### Sin Docker (Node.js portable)

**Backend:**
```bash
cd mi-proyecto/backend
npm install
node app.js
```

**Frontend:**  
Copia la carpeta `frontend/` en `C:\xampp\htdocs\` y ábrelo en:
```
http://localhost:8080/mi-proyecto/frontend/index.html
```

> ⚠️ Sin Docker necesitas tener XAMPP corriendo y añadir CORS en `app.js` apuntando al puerto correcto.

---

## 🔌 API Endpoints

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login de usuario |

#### Registro — body:
```json
{
  "email": "user@example.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

#### Login — body:
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

---

### Notas

> Todas las rutas requieren el header `x-user-id: <userId>`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/notes` | Listar notas propias |
| POST | `/api/notes` | Crear nota |
| PUT | `/api/notes/:id` | Editar nota propia |
| DELETE | `/api/notes/:id` | Eliminar nota propia |

#### Crear/editar nota — body:
```json
{
  "title": "Mi nota",
  "content": "Contenido de la nota"
}
```
---

## 📦 Dependencias

```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "express": "^4.18.2",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0",
  "sanitize-html": "^2.11.0",
  "uuid": "^9.0.0"
}
```

---


