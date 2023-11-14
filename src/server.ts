import express from "express";
import http from "http";
import { Server } from 'socket.io';

// express app
const app = express();
const port = 3000;

// server for socket.io
const server = http.createServer(app);
const io = new Server(server);

// socket.io stuff
io.on('connection', (socket) => {
    console.log(`A user has connected! Their ID is ${socket.id}`);
});

// routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// actually run the server
server.listen(port, () => {
    console.log(`FishGPT Backend listening on http://localhost:${port}`);
});