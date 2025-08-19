// index.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Homepage route
app.get("/", (req, res) => {
  res.send("Hello World! 🚀 Your server is running.");
});

// Example API route
app.get("/api", (req, res) => {
  res.json({ message: "This is your API endpoint" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});