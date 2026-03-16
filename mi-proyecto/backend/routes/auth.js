const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../utils/db");

router.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword)
    return res.status(400).json({ error: "All fields are required." });
  if (password !== confirmPassword)
    return res.status(400).json({ error: "Passwords do not match." });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  const db = readDB();
  if (db.users.find((u) => u.email === email))
    return res.status(409).json({ error: "Email already registered." });

  const hashed = await bcrypt.hash(password, 10);
  db.users.push({ id: uuidv4(), email, password: hashed, created_at: new Date().toISOString() });
  writeDB(db);
  res.status(201).json({ message: "User registered successfully." });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields are required." });

  const db = readDB();
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials." });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials." });

  // TODO: replace with JWT or session once auth method is decided
  res.json({ message: "Login successful.", userId: user.id });
});

module.exports = router;
