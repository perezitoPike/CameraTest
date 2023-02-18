// if (process.argv[2] == undefined) {
//     global.console.log("Usage: node application.js <COM#>");
//     process.exit(1);
// }
// let portCom = process.argv[2];

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const socketServer = require('./socketServer');

const path = require('path');
const cors = require('cors');

server.listen(4000, () => {
    console.log('servidor en puerto 4000');
});

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//Middlewares
//routes
app.use(cors({
    origin: "*",
    methods: ["POST","GET","OPTIONS","PUT","DELETE"],
    allowedHeaders: ["Content-Tyoe", "X-Aunth-Token","Origin","Authorization"]
}));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/static',express.static(path.join(__dirname,'./public/uploads')));
app.use(require('./routes/index.routes'));

const {SerialPort} = require('serialport');
const {DelimiterParser} = require('@serialport/parser-delimiter');

// const port = new SerialPort({
//     path: portCom,
//     baudRate: 9600,
// });

// const parser = port.pipe(new DelimiterParser({delimiter: '\n'}));

// parser.on('open', function () {
//     console.log('connection is opened');
// });

// parser.on('data', function (data) {
//     io.emit('arduinoMessage', data.toString());
// });

// parser.on('error', (err) => console.log(err));
// port.on('error', (err) => console.log(err));

//Socket Server
socketServer(server);