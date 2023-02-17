module.exports = (server) => {
    const socketIo = require('socket.io');
    const io = socketIo(server);

    io.on("connect", (socket)=>{
        console.log("Se Conecto un nuevo usuario");

        socket.on("updateImages", (fielName)=>{
            socket.broadcast.emit("updateNewImage", fielName);
        });
    });
}