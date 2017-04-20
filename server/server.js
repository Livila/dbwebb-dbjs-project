#!/usr/bin/env node
"use strict";
// för pid-filen
const fs = require('fs');
const path = require('path');
var pid = `${process.pid}`;
// skriv pid-filen
var filepathPID = path.join(__dirname, "pid");
fs.writeFile(filepathPID, pid, (err) => {
    if (err) {
        throw err;
    }
    console.log("pid saved at: " + __dirname);
});
// skapa express-severn
const bodyparser = require('body-parser');
var express = require('express');
var app = express();
var port = 1337;
var staticfiles = path.join(__dirname, 'public');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.locals.pretty = true;
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(staticfiles));

if ('LINUX_PORT' in process.env) {
    port = `${process.env.LINUX_PORT}`;
    console.log("LINUX_PORT is set to " + port + ".");
} else {
    console.log("LINUX_PORT is set to " + port + ".");
    console.log("Server running at http://127.0.0.1." + port + ": with PID: " + process.pid);
}

// ladda routes

const index = require('./routes/index.js');
app.use("/", index);
const login = require('./routes/login.js');
app.use("/login", login);
const startpage = require('./routes/startpage.js');
app.use("/startpage", startpage);
const movemoney = require('./routes/movemoney.js');
app.use("/movemoney", movemoney);
const swish = require('./routes/swish.js');
app.use("/swish", swish);
/*
const log = require('./routes/log.js');
app.use("/log", log);
const move = require('./routes/move.js');
app.use("/move", move);
const movereq = require('./routes/movereq.js');
app.use("/movereq", movereq);
*/


app.listen(port);
module.exports = app;
