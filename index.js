const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

const correctPassword = "2008";

app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (like HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Handle login POST request
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === correctPassword) {
    res.send('<h2 style="color:green;">Access Granted!</h2>');
  } else {
    res.send('<h2 style="color:red;">Incorrect Password. Try again.</h2><a href="/">Back</a>');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});