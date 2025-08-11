const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "public" folder
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});/public          # your frontend files (HTML, CSS, JS)
/uploads         # create this folder, writable for images
index.js        # server code like above
package.json    # with dependencies (express, socket.io, multer)