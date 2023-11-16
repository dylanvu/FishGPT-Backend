import express from "express";
import http from "http";
import socketio, { Server } from 'socket.io';

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

    // the python client has sent images
    socket.on('imageSend', (image) => {
        console.log(image["data"]);
        // send image buffer to all clients except the sender
        io.emit("imageReceive", image);
    })

    // the python client has sent coordinates
    socket.on('coordsSend', (coords) => {
        console.log(coords["data"]);
        io.emit('coordsReceive', coords);
    })

});

// routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// actually run the server
server.listen(port, () => {
    console.log(`FishGPT Backend listening on http://localhost:${port}`);
});