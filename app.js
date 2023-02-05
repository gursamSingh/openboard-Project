const express = require("express"); // access the server
const socket = require("socket.io");


const app = express(); // initialize and setup the server ready

app.use(express.static("public")); // display the htm contents on the url


let port = process.env.PORT || 3000;
let server = app.listen(port, ()=>{
    console.log("Listening to port" + port);
})

let io = socket(server);

io.on("connection",(socket)=>{
    console.log("Made socket connection");
     // Received data
    socket.on("beginPath",(data) =>{
        // data -> data from frontend
        // Now transfer data to all connected computers
        io.sockets.emit("beginPath",data);
    })

    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data);
    })

    socket.on("redoUndo",(data)=>{
        io.sockets.emit("redoUndo",data);
    })
})

