require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const http = require('http');

const START_PORT = Number(process.env.PORT || 5001);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function start() {
  await connectDB();

  let port = START_PORT;

  function listenOnNextPort() {
    const server = http.createServer(app);

    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        port += 1;
        listenOnNextPort();
        return;
      }

      throw error;
    });

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  listenOnNextPort();
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
