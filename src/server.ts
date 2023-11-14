import express from "express";
import http from "http";
import { Server } from 'socket.io';
// import mediasoup from "mediasoup";

// express app
const app = express();
const port = 5000;

// server for socket.io
const server = http.createServer(app);
const io = new Server(server);

// socket.io stuff
io.on('connection', async (socket) => {
    console.log(`A user has connected! Their ID is ${socket.id}`);

    // context: the python script just turned on, and needs to create an offer with all
    socket.on('openCVoffer', (data, socket) => {
        console.log(data);
    });


});

// routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// actually run the server
server.listen(port, () => {
    console.log(`FishGPT Backend listening on http://localhost:${port}`);
});