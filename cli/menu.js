'use strict';

const readline = require('readline');
var VERSION = "none"; // Will be updated from cli.js once it's loaded.

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sql = require('./sql');

const helpText = `Available commands (not case sensitive):
  exit, help, version
  resetDatabase, fillDatabase
  moveMoneyWeb, moveMoneySwish     - Move money using services provided
  showUsers                        - Show users with accounts
  showSpecUser                     - Show a specific user
  addUser                          - Add a new user
  addAccount                       - Add a new bank account
  connectUserToAccount             - Connect a user to a bank account
  calculateAllInterests            - Calculate all interests
  calculateInterest                - Calculate one interest
  showAllAccumulatedInterests      - Show all interests accumulated
  showAccumulatedInterest          - Show accumulated interest for one account
  showLog                          - Show entries in logs interest and customer
  showBank                         - Show the bank account
`;

var connectToDatabase = (databaseConnOpt) => {
    sql.init(databaseConnOpt)
        .then(() => {
            console.log('Connected to the cli!');
            console.log(helpText);
            readlineInterface.prompt();
        })
        .catch((err) => {
            console.log('Something went wrong... please make sure that:');
            console.log(' - that the database exists.');
            console.log(' - that you are using the correct username and password.');
            console.log(' - that the user you are using has enough permission.');
            console.log();

            readlineInterface.question('Do you want to try again? (log/yes/no)', function (answer) {
                if (answer == 'yes' || answer == 'y') {
                    connectToDatabase(databaseConnOpt);
                } else if (answer == 'log' || answer == 'l') {
                    console.log(err);
                    process.exit(1);
                } else {
                    console.log('See you!');
                    process.exit(1);
                }
            });
        });
};

var mainLoop = (databaseConnOpt, version) => {
    readlineInterface.setPrompt('Internetbanken$ ');
    VERSION = version;

    connectToDatabase(databaseConnOpt);
};

var exitMainLoop = () => {
    sql.end();
    console.log("See you!");
    process.exit(0);
};


var readlineInterfaceCon = (line) => {
    switch (line.trim().toLowerCase()) {
        case "calculateallinterests":
            sql.calculateAllInterests().then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "calculateinterest":
            sql.calculateInterest(readlineInterface).then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "showallaccumulatedinterests":
            sql.showAllAccumulatedInterests().then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "showaccumulatedinterest":
            sql.showAccumulatedInterest(readlineInterface).then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "showlog":
            sql.showLog(readlineInterface).then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "showbank":
            sql.showBank().then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "movemoneyweb":
            sql.moveMoneyWeb().then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "movemoneyswish":
            sql.moveMoneySwish().then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
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
};

readlineInterface.on('line', (line) => {
    var hasExecuted = 0;

    switch (line.trim().toLowerCase()) {
        case "exit":
            hasExecuted = 1;
            exitMainLoop();
            break;

        case "help":
            hasExecuted = 1;
            console.log(helpText);
            readlineInterface.prompt();
            break;

        case "version":
            hasExecuted = 1;
            console.log("Version " + VERSION);
            readlineInterface.prompt();
            break;

        case "resetdatabase":
            hasExecuted = 1;
            sql.resetDatabase();
            readlineInterface.prompt();
            break;

        case "filldatabase":
            hasExecuted = 1;
            sql.fillDatabase();
            readlineInterface.prompt();
            break;

        case "showusers":
            hasExecuted = 1;
            sql.showUsers().then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "showspecuser":
            hasExecuted = 1;
            sql.showSpecUser(readlineInterface).then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "adduser":
            hasExecuted = 1;
            sql.addUser(readlineInterface).then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "addaccount":
            hasExecuted = 1;
            sql.addAccount(readlineInterface).then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
                throw err;
            });
            break;

        case "connectusertoaccount":
            hasExecuted = 1;
            sql.connectUserToAccount(readlineInterface).then(() => {
                readlineInterface.prompt();
            }).catch((err) => {
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

    // Because of a jshint warning.
    if (hasExecuted === 0) {
        readlineInterfaceCon(line);
    }
});

readlineInterface.on('close', exitMainLoop);

module.exports = {
    mainLoop: mainLoop
};
