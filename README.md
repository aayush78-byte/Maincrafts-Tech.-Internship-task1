# MERN Stack Internship — Task 1

**Deliverable:** A React app that displays data from an Express + MongoDB API.

This project has two parts, each in its own folder:

```
mern-task1/
├── backend/     Express API + MongoDB (Mongoose)
└── frontend/    React app (Vite)
```

## What it does

- The **backend** exposes a REST API at `/api/items` (GET, POST, PATCH, DELETE)
  backed by a MongoDB collection of simple "task" documents (`title`,
  `description`, `completed`).
- The **frontend** is a React app that fetches the list of tasks from that
  API on load, lets you add a new task, mark one as done (click the text),
  and delete one.

This covers the task brief exactly: React frontend + basic backend API,
fetching data from Express + MongoDB.

## 1. Set up MongoDB Atlas

1. Create a free account/cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access from your IP (or `0.0.0.0/0` for local dev).
3. Copy your connection string — it looks like:
   `mongodb+srv://<username>:<password>@<cluster-url>/mern_task1?retryWrites=true&w=majority`

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env
# then edit .env and paste your MongoDB connection string into MONGO_URI
npm run dev
```

The API will start on `http://localhost:5000`. Visit `http://localhost:5000/`
in a browser — you should see "MERN Task 1 API is running".

Test it further with **Postman** or `curl`:

```bash
curl http://localhost:5000/api/items
```

## 3. Run the frontend

In a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

Vite will start the app on `http://localhost:5173`. Open it in your browser —
you should see the task list UI, initially empty, pulling live data from your
Express API.

## 4. Try it out

- Add a task using the form — it POSTs to the API and the list refreshes.
- Click a task's title to toggle it as completed (strikethrough).
- Click "Delete" to remove a task.
- Refresh the page — the data persists because it's stored in MongoDB, not
  just in React state.

## Notes / next steps

- The frontend calls `http://localhost:5000` directly. For production you'd
  move this into an environment variable (e.g. `VITE_API_URL`) instead of
  hardcoding it.
- CORS is enabled on the backend (`cors` middleware) so the two dev servers
  (5173 and 5000) can talk to each other.
- Feel free to rename "Item" / "task" to match whatever domain your later
  tasks build on (e.g. products, notes, contacts) — the CRUD pattern here
  (`models/Item.js`, `routes/items.js`) is a template you can copy.
