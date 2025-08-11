# 1. Make project folder and go inside it
mkdir myproject
cd myproject

# 2. Initialize npm project (creates package.json)
npm init -y

# 3. Install needed dependencies
npm install express socket.io multer

# 4. Create folders: public for frontend, uploads for images
mkdir public uploads

# 5. Create index.js file with the server code
cat > index.js << 'EOF'
const express = require('express');
const http = require('http');
const path = require('path');
const multer = require('multer');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// Set up multer for image uploads to "uploads" folder
const upload = multer({
  dest: path.join(__dirname, 'uploads/')
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve socket.io client script
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')));

// Serve main page (all-in-one HTML+CSS+JS)
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Friends Chat Site</title>
<style>
  body {
    margin:0; padding:0; font-family: Arial, sans-serif;
    background: #121212; color: #eee;
    display: flex; flex-direction: column; align-items: center;
    min-height: 100vh;
  }
  #login, #app {
    width: 100%; max-width: 450px;
    padding: 20px; box-sizing: border-box;
  }
  #login {
    margin-top: 100px;
  }
  input, button {
    width: 100%;
    padding: 10px;
    margin: 8px 0;
    border-radius: 5px;
    border: none;
    font-size: 1.1rem;
  }
  button {
    background: #3a86ff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  button:hover {
    background: #265dde;
  }
  #menu {
    display: flex; justify-content: space-around;
    margin-bottom: 15px;
  }
  #menu button {
    flex-grow: 1;
    margin: 0 5px;
    padding: 10px 0;
    font-weight: bold;
    background: #282828;
    color: #eee;
    border-radius: 5px;
    border: none;
    cursor: pointer;
  }
  #menu button.active {
    background: #3a86ff;
  }
  section {
    display: none;
  }
  section.active {
    display: block;
  }
  /* Chat Section */
  #messages {
    height: 200px;
    overflow-y: auto;
    background: #222;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }
  #messages div {
    margin-bottom: 8px;
  }
  #chat form {
    display: flex;
    gap: 5px;
  }