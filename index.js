const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config({ path: "./.env", quiet: true });
const { mongoConnect } = require("./config/database");
const { connectKafka } = require("./config/kafka");
const { startMessageConsumer } = require("./utils/Consumers");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = process.env.NODE_APP_PORT || 8002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Routes
app.use("/api/v1", require("./routes").routes);

const logDirectory = path.join(__dirname, "storage/logs");

fs.mkdirSync(logDirectory, { recursive: true });

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "storage/logs/access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

const userSockets = {};

// Socket.IO connection
io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);
  const userId = socket.handshake.auth.userId;

  if (!userSockets[userId]) {
    userSockets[userId] = [];
  }
  userSockets[userId].push(socket.id);
  console.log("Current active sockets:", userSockets);
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("disconnect", () => {
    userSockets[userId] = userSockets[userId].filter((id) => id !== socket.id);
  });
});

(async () => {
  try {
    await mongoConnect();
    await connectKafka();
    await startMessageConsumer(io);

    server.listen(port, async () =>
      console.log(
        `\x1b[33mCompiled successfully on port: \x1b[34m${port}\x1b[0m`
      )
    );
  } catch (error) {
    console.error("Failed to start the application:", error.message);
    process.exit(1);
  }
})();
