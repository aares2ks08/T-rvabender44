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
  #messageInput {
    flex-grow: 1;
    padding: 8px;
    border-radius: 5px;
    border: none;
  }
  #chat button {
    background: #3a86ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    padding: 0 15px;
  }
  /* Pictures Section */
  #pictures img {
    max-width: 100%;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  #pictures #pictureList > div {
    margin-bottom: 10px;
  }
  /* Settings Section */
  #settings img {
    max-width: 120px;
    border-radius: 50%;
    margin-bottom: 10px;
    border: 2px solid #3a86ff;
  }
</style>
</head>
<body>

<div id="login">
  <h2>Login</h2>
  <input id="username" placeholder="Username" autocomplete="off" />
  <input id="password" type="password" placeholder="Password" autocomplete="off" />
  <button id="loginBtn">Login</button>
  <div id="loginError" style="color:#f44336; margin-top: 10px;"></div>
</div>

<div id="app" style="display:none;">
  <div id="menu">
    <button data-section="chat" class="active">Chat</button>
    <button data-section="pictures">Pictures</button>
    <button data-section="settings">Settings</button>
    <button data-section="votes">Votes</button>
  </div>

  <section id="chat" class="active">
    <h3>Chat Room</h3>
    <div id="messages"></div>
    <form id="messageForm">
      <input id="messageInput" autocomplete="off" placeholder="Type your message..." />
      <button type="submit">Send</button>
    </form>
  </section>

  <section id="pictures">
    <h3>Pictures</h3>
    <form id="uploadForm" enctype="multipart/form-data">
      <input type="file" name="image" id="imageInput" accept="image/*" required />
      <button type="submit">Upload Picture</button>
    </form>
    <div id="pictureList"></div>
  </section>

  <section id="settings">
    <h3>Settings</h3>
    <div>
      <img id="profilePic" src="" alt="No Profile Picture" />
      <form id="profilePicForm" enctype="multipart/form-data">
        <input type="file" name="profilePic" id="profilePicInput" accept="image/*" />
        <button type="submit">Upload Profile Picture</button>
      </form>
    </div>
  </section>

  <section id="votes">
    <h3>Votes</h3>
    <p>Voting system coming soon...</p>
  </section>
</div>

<script src="/socket.io/socket.io.js"></script>
<script>
  // Simple users for demo, username => password
  const users = {
    'Tissid': '51area51',
    'Raen': '0000',
    'Kova': '0000'
  };

  const loginDiv = document.getElementById('login');
  const appDiv = document.getElementById('app');
  const loginBtn = document.getElementById('loginBtn');
  const loginError = document.getElementById('loginError');
  let currentUser = null;
  let profilePicUrl = '';

  loginBtn.onclick = () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if(users[username] && users[username] === password){
      currentUser = username;
      loginDiv.style.display = 'none';
      appDiv.style.display = 'block';
      setProfilePic('');
      setupSocket();
    } else {
      loginError.textContent = 'Invalid username or password.';
    }
  };

  // Menu switching
  const menuButtons = document.querySelectorAll('#menu button');
  const sections = document.querySelectorAll('section');

  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sections.forEach(s => s.classList.remove('active'));
      const sec = document.getElementById(btn.dataset.section);
      if(sec) sec.classList.add('active');
    });
  });

  // Socket.io and chat
  let socket;
  function setupSocket(){
    socket = io();

    const messagesDiv = document.getElementById('messages');
    const form = document.getElementById('messageForm');
    const input = document.getElementById('messageInput');

    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = input.value.trim();
      if(msg){
        socket.emit('chat message', { user: currentUser, text: msg });
        input.value = '';
      }
    });

    socket.on('chat message', msg => {
      const div = document.createElement('div');
      div.textContent = msg.user + ': ' + msg.text;
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
  }

  // Pictures upload
  const uploadForm = document.getElementById('uploadForm');
  const pictureList = document.getElementById('pictureList');

  uploadForm.addEventListener('submit', e => {
    e.preventDefault();
    const fileInput = document.getElementById('imageInput');
    if(!fileInput.files.length) return alert('Please select an image');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', file);
    fetch('/upload', {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(data => {
        if(data.success){
          addPicture(data.filepath);
          fileInput.value = '';
        } else {
          alert('Upload failed');
        }
      });
  });

  function addPicture(url){
    const div = document.createElement('div');
    div.innerHTML = `<img src="${url}" alt="Uploaded Image" />`;
    pictureList.prepend(div);
  }

  // Profile picture upload
  const profilePicForm = document.getElementById('profilePicForm');
  const profilePicImg = document.getElementById('profilePic');

  profilePicForm.addEventListener('submit', e => {
    e.preventDefault();
    const inputFile = document.getElementById('profilePicInput');
    if(!inputFile.files.length) return alert('Select a profile picture');
    const file = inputFile.files[0];
    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('user', currentUser);
    fetch('/uploadProfilePic', {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(data => {
        if(data.success){
          setProfilePic(data.filepath);
          inputFile.value = '';
        } else {
          alert('Profile picture upload failed');
        }
      });
  });

  function setProfilePic(url){
    profilePicUrl = url || '';
    profilePicImg.src = url || '';
  }
</script>
</body>
</html>
`);
});

// Image upload endpoint for pictures
app.post('/upload', upload.single('image'), (req, res) => {
  if(!req.file) return res.json({ success: false });
  const filePath = '/uploads/' + req.file.filename;
  res.json({ success: true, filepath: filePath });
});

// Image upload endpoint for profile picture
app.post('/uploadProfilePic', upload.single('profilePic'), (req, res) => {
  if(!req.file || !req.body.user) return res.json({ success: false });
  // For simplicity just send back the uploaded image path, no user DB
  const filePath = '/uploads/' + req.file.filename;
  res.json({ success: true, filepath: filePath });
});

// Socket.io message handling
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});