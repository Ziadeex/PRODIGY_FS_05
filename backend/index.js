const express = require("express");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const auth = require("./routes/auth");
const media = require('./routes/MediaRoutes')
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
port = process.env.APP_PORT;

const currentDirectory = __dirname;
const buildDirectory = path.join(currentDirectory, "build");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ origin: "*" }));


 
app.use(express.static(buildDirectory));

app.get("/", (req, res) => {
  res.send({ message: "Ok from the server side" });
});
 
app.use("/api/auth", auth);
app.use("/api/media", media);
 


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('send_message', (messageData) => {
    io.emit('new_message', messageData); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`my app is running on ${port}`);
});
