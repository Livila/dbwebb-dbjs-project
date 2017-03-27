'use strict';

const readline = require('readline');
var VERSION = "none"; // Will be updated from cli.js once it's loaded.

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sql = require('./sql');

const helpText = `Available commands:
  exit, help, version, resetdatabase, filldatabase, users`;

var mainLoop = (databaseConnOpt, version) => {
    readlineInterface.setPrompt('Internetbanken$ ');
    VERSION = version;

    checkOptionsRequired(databaseConnOpt);
    connectToDatabase(databaseConnOpt);
};

var checkOptionsRequired = (databaseConnOpt) => {
    if (databaseConnOpt.password == '?') {
        var value = ask('Enter password: ');
        databaseConnOpt.password = value;
    }
};

var connectToDatabase = (databaseConnOpt) => {
    return sql.init(databaseConnOpt)
    .then(() => {
        console.log('Connected!');
        console.log(helpText);
        readlineInterface.prompt();
    })
    .catch((err) => {
        console.log('Something went wrong... please make sure that:');
        console.log(' - that the database exists.');
        console.log(' - that you are using the correct username and password.');
        console.log(' - that the user you are using has enough permission.');
        console.log();

        connectToDatabaseQuestion(databaseConnOpt, err);
    });
};

var connectToDatabaseQuestion = (databaseConnOpt, err) => {
    readlineInterface.question('Do you want to try again? (log/yes/no)', function(answer) {
        if (answer == 'yes' || answer == 'y') {
            connectToDatabase(databaseConnOpt);
        } else if (answer == 'log' || answer == 'l') {
            console.log(err);
            connectToDatabaseQuestion(databaseConnOpt, err);
        } else {
            console.log('See you!');
            process.exit(1);
        }
    });
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

        case "":
            readlineInterface.prompt();
        break;

        default:
            console.log('Error: Please try another command. ' + helpText);
            readlineInterface.prompt();
        break;
    }
});

readlineInterface.on('close', exitMainLoop);

function ask(question, reply) {
    readlineInterface.question(question, function(answer) {
        return answer;
    });
};

module.exports = {
    mainLoop: mainLoop
};
