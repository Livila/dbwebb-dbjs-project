'use strict';

const readline = require('readline');
var VERSION = "none";

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sql = require('./sql');

const helpText = `Available commands:
  exit, help, version, resetdatabase, filldatabase, users`;

var mainLoop = (databaseConnOpt, version) => {
    readlineInterface.setPrompt('Internetbanken$ ');

    connectToDatabase(databaseConnOpt);

    VERSION = version;

    console.log(helpText);
};


var connectToDatabase = (databaseConnOpt) => {
    sql.init(databaseConnOpt)
    .then(() => {
        console.log('Connected!');
        readlineInterface.prompt();
    })
    .catch((err) => {
        console.log('Something went wrong...');

        readlineInterface.question('Do you want to try again? (yes/no/log)', function(answer) {
            if (answer == 'yes' || answer == 'y') {
                connectToDatabase(databaseConnOpt);
            } else if (answer == 'log' || answer == 'l') {
                console.log(err);
                connectToDatabase(databaseConnOpt);
            } else {
                process.exit(1);
            }
        });
    });
}


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
