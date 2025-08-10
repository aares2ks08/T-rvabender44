app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: user='${username}', pass='${password}'`);

  if (users[username] && users[username] === password) {
    res.redirect(`/chat.html?user=${encodeURIComponent(username)}`);
  } else {
    res.send('Invalid username or password. <a href="/">Try again</a>');
  }
});
