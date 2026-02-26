const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/db/index");
const { initializeSocket } = require("./src/socket.js");

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

connectDB()
  .then(() => {
    initializeSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to DB: ", error);
    process.exit(1);
  }); 