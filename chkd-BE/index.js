require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require("cors");
const connectDb = require("./database/db");

const surgery = require("./routes/surgery");
const keywds = require("./routes/keywds");
const login = require("./routes/login");
const user = require("./routes/user");
const surgeryType = require("./routes/surgeryType");
const auth = require("./routes/auth");
const surgeon = require("./routes/surgeon")

const app = express();
const port = process.env.PORT || 3000;

connectDb();
app.use(express.json({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: true, credentials: true }));
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

app.listen(port, () => console.log("app running at - " + port))