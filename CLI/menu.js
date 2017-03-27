'use strict';

const readline = require('readline');
var VERSION = "none";

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sql = require('./sql');

const helpText = `Available commands:
  exit, help, version, users`;

var mainLoop = (databaseConnOpt, version) => {
    sql.init(databaseConnOpt);
    VERSION = version;

    console.log(helpText);

    readlineInterface.setPrompt('Internetbanken$ ');
    readlineInterface.prompt();
};


var exitMainLoop = () => {
    sql.end();
    console.log("See you!");
    process.exit(0);
};


readlineInterface.on('line', (line) => {
    switch (line.trim().toLowerCase()) {
        case "exit":
            exitMainLoop();
        break;

        case "help":
            console.log(helpText);
            readlineInterface.prompt();
        break;

        case "version":
            console.log("Version " + VERSION);
            readlineInterface.prompt();
        break;

        case "resetdatabase":
            sql.resetDatabase();
            readlineInterface.prompt();
        break;

        case "filldatabase":
            sql.fillDatabase();
            readlineInterface.prompt();
        break;

        case "users":
            sql.showUsers()
            .then((/*value*/) => {
                readlineInterface.prompt();
            })
            .catch((err) => {
                throw err;
            });
        break;

        default:
            console.log('Error: Please try another command. ' + helpText);
            readlineInterface.prompt();
        break;
    }
});

readlineInterface.on('close', exitMainLoop);

module.exports = {
    mainLoop: mainLoop
};
