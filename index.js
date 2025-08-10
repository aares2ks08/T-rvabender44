const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from 'public' folder (optional, if you have other assets)
app.use(express.static(path.join(__dirname, 'public')));

// Serve your custom HTML on root or custom route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public-fourdigit-password.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});