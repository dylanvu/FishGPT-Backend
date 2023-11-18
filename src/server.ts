import express from "express";
import http from "http";
import socketio, { Server } from 'socket.io';

let viewCount = -1;

// express app
const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const port = 3000;

// server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// socket.io stuff
io.on('connection', async (socket: socketio.Socket) => {
    console.log(`A user has connected! Their ID is ${socket.id}`);
    viewCount++;
    // transmit new viewCount
    transmitViewCount(viewCount, io);
    // the python client has sent images
    socket.on('imageSend', (image) => {
        // console.log(image["data"]);
        // send image buffer to all clients except the sender
        io.emit("imageReceive", image);
    });

    // the python client has sent coordinates
    socket.on('coordsSend', (coords) => {
        console.log(coords["data"]);
        io.emit('coordsReceive', coords);
    });

    socket.on('disconnect', (reason) => {
        console.log(`User with id ${socket.id} has disconnected: ${reason}`);
        viewCount--;
        transmitViewCount(viewCount, io);
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

function transmitViewCount(count: number, io: socketio.Server): void {
    let localCount = count;
    if (count < 0) {
        localCount = 0;
    }
    // send to all clients listening with new view count
    io.emit("sendViewCount", { data: localCount });
}