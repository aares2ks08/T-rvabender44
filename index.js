<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>4-Digit Password Login</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 2rem;
    }
    input {
      font-size: 1.2rem;
      width: 100px;
      padding: 0.3rem;
    }
    button {
      font-size: 1.2rem;
      padding: 0.3rem 0.6rem;
    }
    #message {
      margin-top: 1rem;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h2>Enter 4-digit password</h2>
  <input type="password" id="passwordInput" maxlength="4" pattern="\d{4}" autocomplete="off" />
  <button onclick="checkPassword()">Login</button>
  <div id="message"></div>

  <script>
    const correctPassword = "2008";

    function checkPassword() {
      const input = document.getElementById("passwordInput").value;
      const messageDiv = document.getElementById("message");

      if (input === correctPassword) {
        messageDiv.style.color = "green";
        messageDiv.textContent = "Access Granted!";
        // Here you can redirect or show protected content
      } else {
        messageDiv.style.color = "red";
        messageDiv.textContent = "Incorrect Password. Try again.";
      }
    }
  </script>
</body>
</html>