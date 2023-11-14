import express from "express";
import http from "http";
import socketio, { Server } from 'socket.io';
import cors from "cors";

// express app
const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const port = 5000;

// server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let pythonSocketId: null | string = null;

// socket.io stuff
io.on('connection', async (socket: socketio.Socket) => {
    console.log(`A user has connected! Their ID is ${socket.id}`);

    // context: the python script has just connected and this backend needs to remember that this is the main python client
    socket.on("pythonConnect", (_) => {
        // save the pythonSocketId
        console.log(`python client has connected, this is the id: ${socket.id}`);
        pythonSocketId = socket.id;
    });

    socket.on("pythonDisconnect", (_) => {
        console.log("python client has disconnected")
        pythonSocketId = null;
    });

    // context: the python script needs to create an offer with all
    socket.on('pythonOffer', (data) => {
        // console.log(data);
    });


    // context: a new client has just connected and created an offer and requested to connect to the python client
    socket.on('clientOffer', (data) => {
        console.log(`incoming sdp from js client`);
        // forward the offer to the client
        if (pythonSocketId) {
            console.log(`Sending sdp data to python client ${pythonSocketId}`);
            io.to(pythonSocketId).emit('incoming_sdp', data);
        } else {
            console.log("python socket id is not found")
        }
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