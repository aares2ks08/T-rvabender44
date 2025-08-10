<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <title>Neon Blob Password Prompt with Animation & Sound</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');

    * {
      box-sizing: border-box;
    }
    body, html {
      margin: 0; padding: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #111;
      font-family: 'Poppins', sans-serif;
      color: #eee;
      overflow: hidden;
    }
    .blob-container {
      position: relative;
      width: 350px;
      height: 180px;
      filter: drop-shadow(0 0 20px #ff00ffaa);
    }
    svg {
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      animation: blobMove 8s infinite alternate ease-in-out;
      filter: drop-shadow(0 0 10px #ff00ffaa);
    }
    @keyframes blobMove {
      0% {
        border-radius: 60% 40% 60% 40% / 60% 60% 40% 40%;
      }
      50% {
        border-radius: 30% 70% 40% 60% / 70% 30% 60% 40%;
      }
      100% {
        border-radius: 60% 40% 60% 40% / 60% 60% 40% 40%;
      }
    }

    form {
      position: relative;
      background: rgba(255, 0, 255, 0.2);
      backdrop-filter: blur(20px);
      border-radius: 60% 40% 60% 40% / 60% 60% 40% 40%;
      padding: 2rem 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      z-index: 1;
      box-shadow:
        0 0 20px #ff00ffaa,
        inset 0 0 40px #ff00ffaa;
      transition: transform 0.3s ease;
    }

    form.shake {
      animation: shake 0.4s ease-in-out;
    }
    form.success {
      animation: glowPulse 1.5s ease-in-out infinite alternate;
      box-shadow:
        0 0 30px #4fff87,
        inset 0 0 50px #4fff87;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-10px); }
      40%, 80% { transform: translateX(10px); }
    }

    @keyframes glowPulse {
      0% {
        box-shadow:
          0 0 20px #4fff87,
          inset 0 0 40px #4fff87;
      }
      100% {
        box-shadow:
          0 0 60px #4fff87,
          inset 0 0 80px #4fff87;
      }
    }

    input {
      font-size: 3rem;
      width: 130px;
      height: 70px;
      border-radius: 40px;
      border: none;
      text-align: center;
      background: rgba(255 255 255 / 0.15);
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.35em;
      outline: none;
      box-shadow:
        0 0 15px #ff00ff88;
      transition: background 0.3s ease;
      user-select: none;
    }
    input::placeholder {
      color: #ffccff88;
    }
    input:focus {
      background: rgba(255 255 255 / 0.4);
      box-shadow:
        0 0 20px #ff00ffee,
        0 0 40px #ff00ffbb;
    }
    button {
      font-size: 1.5rem;
      padding: 0.5rem 1.8rem;
      border-radius: 40px;
      border: none;
      cursor: pointer;
      background: #ff00ff;
      color: white;
      font-weight: 700;
      box-shadow:
        0 0 20px #ff00ffcc;
      transition: box-shadow 0.3s ease, transform 0.15s ease;
      user-select: none;
    }
    button:hover {
      box-shadow:
        0 0 30px #ff00ffee,
        0 0 50px #ff00ffee;
      transform: scale(1.1);
    }

    #message {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 1rem;
      font-weight: 700;
      font-size: 1.25rem;
      user-select: none;
      color: #ff66ff;
      text-shadow:
        0 0 5px #ff00ffaa,
        0 0 10px #ff00ffaa;
      min-height: 1.5em;
    }
  </style>
</head>
<body>

  <div class="blob-container">
    <form id="passwordForm" autocomplete="off" aria-label="4 digit password form">
      <input
        type="password"
        id="password"
        maxlength="4"
        pattern="\d{4}"
        placeholder="••••"
        aria-label="Enter 4 digit password"
        required
        inputmode="numeric"
      />
      <button type="submit">Enter</button>
    </form>
    <div id="message