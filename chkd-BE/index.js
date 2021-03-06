require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require("cors");
const connectDb = require("./database/db");
const firebase = require('./helper/firebase');

const surgery = require("./routes/surgery");
const keywds = require("./routes/keywds");
const login = require("./routes/login");
const user = require("./routes/user");
const surgeryType = require("./routes/surgeryType");
const auth = require("./routes/auth");
const surgeon = require("./routes/surgeon");
const patient = require("./routes/patient");
const messages = require("./routes/messages");
const socketRoute = require("./routes/socket");
const analytics = require("./routes/analytics");

const surgeryData = require("./models/surgery");
const firebaseFn = require("./helper/firebase");

const app = express();
const port = process.env.PORT || 3000;

const http = require('http').createServer(app);
const io = require('socket.io')(http);
io.on('connection', (socket) => {
    console.log("Connected to Socket!!" + socket.id);
    var data = {};
    data.hi = "hello";
    console.log(data);
    io.emit("connect", data);
    socket.on('updateStatus', (data) => {
        console.log('socketData: ' + JSON.stringify(data));
        socketRoute.updateStatus(io, data);
    });
    socket.on('sendMessage', (data) => {
        socketRoute.sendMessage(io, data);
    })
    socket.on('clearmsg', (data) => {
        console.log("clear");
        io.emit('changeclr', data);
    })
    socket.on('msg', (data) => {
        console.log(data);
    })
})

connectDb();
app.use(express.json({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: true, credentials: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use('/surgery', surgery)
app.use('/keywds', keywds)
app.use('/login', login)
app.use('/user', user)
app.use('/surgery-type', surgeryType)
app.use("/auth", auth)
app.use("/surgeon", surgeon)
app.use("/patient", patient)
app.use("/messages", messages)
app.use("/analytics", analytics)

app.post('/emitiomsg', async(req, res) => {
    if (req.body.idTo != 999) {
        console.log("id - " + req.body.idTo);
        message = {};
        message.fromId = 999
        message.toId = req.body.idTo
        var response = await firebaseFn.mobileIncrementFunction(message);
        if (response) {
            surgeryData.findOne({ id: req.body.idTo }).then(result => {
                console.log(result.pt_id, req.body.content);
                data = {}
                data.id = result.pt_id;
                data.toId = req.body.idTo;
                var response = { 'success': true, 'message': 'Successfully sent message', 'data': data };
                io.emit(result.pt_id, response);
                io.emit(999, response);
            })
        }
    } else {
        data = {}
        data.fromId = req.body.idFrom;
        message = {};
        message.fromId = req.body.idFrom
        message.toId = 999
        var ffn = await firebaseFn.mobileIncrementFunction(message);
        if (ffn) {
            var response = { 'success': true, 'message': 'Successfully sent message', 'data': data };
            io.emit(999, response);
            io.emit(req.body.idFrom, response);
        }
    }
    res.status(200).json({
        messages: "Sent successfully"
    })
})

http.listen(port, () => console.log("app running at - " + port))