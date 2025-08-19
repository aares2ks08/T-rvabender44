const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend files

// Endpoint: get current score
app.get("/score", (req, res) => {
  let score = parseInt(req.cookies.score || "0");
  res.json({ score });
});

// Endpoint: click cookie
app.get("/click", (req, res) => {
  let score = parseInt(req.cookies.score || "0");
  score++;
  res.cookie("score", score, { httpOnly: false });
  res.json({ score });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍪 Cookie Clicker running at http://localhost:${PORT}`);
});