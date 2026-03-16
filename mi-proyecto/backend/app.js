const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});
