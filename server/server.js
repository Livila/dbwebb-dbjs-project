'use strict';

// Get the module for http and store it in a variable.
var http = require("http");
var port = 8080;

const path = require('path');
const fs = require('fs');

//Check if the port exists as an environment variable.
if ('LINUX_PORT' in process.env) {
    port = process.env.LINUX_PORT;
}

// Use the http variable to create a server.
// The server executes the function for each request it receives.
http.createServer(function (req, res) {
    var url = require('url');
    var route = url.parse(req.url).pathname;

    switch (route) {
        case '/':
        case '/index.html':
            fs.readFile('./index.html', function (err, html) {
                if (err) { throw err; }
                res.writeHeader(200, { "Content-Type": "text/html" });
                res.end(html);
            });
            break;

        case '/status':
            var child = require("child_process");

            child.exec("uname -a", (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log("Something went wrong...", error, stderr);
                }

                var jsonText = '{ "uname": "' + stdout + '" }';
                var jsonParsed = JSON.stringify(jsonText);
                res.writeHeader(200, { "Content-Type": "application/json" });
                res.write(jsonParsed);
                res.end();
            });
            break;

        default:
            res.writeHeader(404, { "Content-Type": "text/plain" });
            res.end("The resource does not exists.");
            break;
    }


}).listen(port);


//Get pid value and save it to a file.
var pidFile = path.join(__dirname, "pid");
fs.writeFile(pidFile, process.pid, function(err) {
    if (err) { throw err; }

    console.log("The process ID is saved to the file 'pid'.");
});


console.log("Server is running at port " + port + " with pid " + process.pid);


function controlledShutdown(signal) {
    console.warn('Caught ' + signal + ' . Removing pid-file and will then exit.');
    fs.unlinkSync(pidFile);
    process.exit();
}

//Add event handlers.
process.on("SIGTERM", () => { controlledShutdown("SIGTERM"); });
process.on("SIGINT", () => { controlledShutdown("SIGINT"); });
