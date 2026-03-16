const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../utils/db");
const sanitizeHtml = require("sanitize-html");

function sanitize(str) {
  if (typeof str !== "string") return "";
  return sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} }).trim();
}

router.get("/", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(401).json({ error: "Unauthorized." });

  const db = readDB();
  const notes = db.notes
    .filter((n) => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(notes);
});

router.post("/", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(401).json({ error: "Unauthorized." });

  const title = sanitize(req.body.title);
  const content = sanitize(req.body.content);

  if (!title || !content)
    return res.status(400).json({ error: "Title and content are required." });

  if (title.length > 100 || content.length > 5000)
    return res.status(400).json({ error: "Title or content too long." });

  const db = readDB();
  const note = {
    id: uuidv4(),
    user_id: userId,
    title,
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.notes.push(note);
  writeDB(db);
  res.status(201).json(note);
});

router.put("/:id", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(401).json({ error: "Unauthorized." });

  const db = readDB();
  const note = db.notes.find((n) => n.id === req.params.id);

  if (!note) return res.status(404).json({ error: "Note not found." });
  if (note.user_id !== userId) return res.status(403).json({ error: "Forbidden." });

  const title = sanitize(req.body.title);
  const content = sanitize(req.body.content);

  if (title) note.title = title;
  if (content) note.content = content;
  note.updated_at = new Date().toISOString();

  writeDB(db);
  res.json(note);
});

router.delete("/:id", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(401).json({ error: "Unauthorized." });

  const db = readDB();
  const index = db.notes.findIndex((n) => n.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: "Note not found." });
  if (db.notes[index].user_id !== userId) return res.status(403).json({ error: "Forbidden." });

  db.notes.splice(index, 1);
  writeDB(db);
  res.json({ message: "Note deleted." });
});

module.exports = router;