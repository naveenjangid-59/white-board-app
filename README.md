# 🎨 White Board App

A real-time collaborative whiteboard built with modern web technologies.  
Draw, write, share canvases, and collaborate live.

---

## ✨ Highlights

- 🖊️ Multiple drawing tools (pen, line, rectangle, circle, arrow, text, eraser)
- 👥 Real-time collaboration with Socket.IO
- 🔐 JWT-based authentication with refresh-token flow
- 💾 Auto-save canvas state to database
- 📤 Canvas sharing and persistence by canvas ID
- ↩️ Undo / Redo support
- 📱 Smooth pointer interactions and responsive canvas rendering

---

## 🧱 Tech Stack

### Frontend
- **React (Vite)**
- **Context API + useReducer** (state management)
- **Socket.IO Client** (live sync)
- **Rough.js** (hand-drawn style primitives)
- **Perfect Freehand** (smooth pen strokes)
- **CSS Modules + Tailwind CSS**

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **Socket.IO Server**
- **JWT Authentication** (access + refresh tokens)
- **Cookie-based auth middleware**

---

## 📂 Project Structure

- `frontend/` → React app (UI, canvas engine, sockets, auth flows)
- `backend/` → Express API (auth, canvas APIs, DB, socket integration)

---

## 🚀 Getting Started

### 1) Clone repository
```bash
git clone <your-repo-url>
cd "White Board App"
```

### 2) Run backend
```bash
cd backend
npm install
npm run dev
```

### 3) Run frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend usually runs on `http://localhost:5173` (Vite default).

---

## 🔐 Environment Variables (Backend)

Create `backend/.env` with your values:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

---

## 📌 Core Modules

- `frontend/src/components/Board/Board.jsx` → drawing, autosave, realtime sync
- `frontend/src/store/BoardContext.jsx` → board actions and state
- `frontend/src/utils/Element.js` → element creation/hydration logic
- `backend/src/controllers/canvas.controller.js` → canvas CRUD/share APIs
- `backend/src/controllers/user.controller.js` → authentication flows
- `backend/index.js` → server bootstrap + socket setup

---

## 🛠️ Scripts

### Frontend
- `npm run dev` → start dev server
- `npm run build` → production build
- `npm run preview` → preview build

### Backend
- `npm run dev` → start backend in development
- `npm start` → start backend in production mode

---

## 📄 License

MIT (recommended). Update this section based on your preference.
