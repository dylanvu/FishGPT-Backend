import express from "express";
import http from "http";
import socketio, { Server } from 'socket.io';
// import mediasoup from "mediasoup";

// express app
const app = express();
const port = 5000;

// server for socket.io
const server = http.createServer(app);
const io = new Server(server);

let pythonSocketId = null;

// socket.io stuff
io.on('connection', async (socket) => {
    console.log(`A user has connected! Their ID is ${socket.id}`);

    // context: the python script has just connected and this backend needs to remember that this is the main python client
    socket.on("pythonOffer", (_) => {
        // save the pythonSocketId
        console.log(`python client has connected, this is the id: ${socket.id}`);
        pythonSocketId = socket.id;
    });

    // context: the python script needs to create an offer with all
    socket.on('pythonOffer', (data) => {
        console.log(data);
    });


    // context: a new client has created an offer and requested to connect to the python client
    socket.on('clientOffer', (data) => {
        // forward the offer to the client
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