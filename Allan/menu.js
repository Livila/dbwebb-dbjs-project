'use strict';

const readline = require('readline');

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sql = require('./sql');

const helpText = `Available commands:
  exit, all, only, products, inventory1, inventory2, supplier1 and supplier2.`;

var mainLoop = (options) => {
    sql.init(options);

    console.log(helpText);

    readlineInterface.setPrompt('Allan$ ');
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

        case "product":
        case "products":
            sql.product()
            .then((/*value*/) => {
                readlineInterface.prompt();
            })
            .catch((err) => {
                throw err;
            });
        break;

        case "inventory1":
            sql.inventory1()
            .then((/*value*/) => {
                readlineInterface.prompt();
            })
            .catch((err) => {
                throw err;
            });
        break;

        case "inventory2":
            sql.inventory2()
            .then((/*value*/) => {
                readlineInterface.prompt();
            })
            .catch((err) => {
                throw err;
            });
        break;

        case "supplier1":
            sql.supplier1()
            .then((/*value*/) => {
                readlineInterface.prompt();
            })
            .catch((err) => {
                throw err;
            });
        break;

        case "supplier2":
            sql.supplier2()
            .then((/*value*/) => {
                readlineInterface.prompt();
            })
            .catch((err) => {
                throw err;
            });
        break;

        case "all":
            sql.all()
            .then((/*value*/) => {
                readlineInterface.prompt();
            })
            .catch((err) => {
                throw err;
            });
        break;

        case "only":
            sql.only()
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
