#!/usr/bin/env node

'use strict';

// Get command line arguments.
const cli = require('./cli');
var databaseConnOpt = cli.checkOptionsArguments();


var readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var sql;



/**
 * Display helptext about usage of this script.
 */
function usage() {
    console.log(`
Options:
 -h        Display help text.
 -v        Display the version.`);
}



/**
 * Display version.
 */
function version() {
    console.log(VERSION);
}



/**
 * Display a menu.
 */
function menu() {
    console.log(`Use any of the commands:
   exit
   menu
   version
   users`);
}

/**
 * Display all users and accounts
 */
function showusers()
{
    sql = 'SELECT * FROM VUserAndAccount;'
    connection.query(sql, (err, res/*, fields*/) => {
    if (err) {
        throw err;
    }
    console.log(res);

    res.forEach((row, count) => {
        console.log(`${count}: ${row.firstName} - ${row.balance}`);
    });
});
}


 /**
  *
  */

/**
* Take a guess.
*
* @param Integer answer a the number to guess.
*/



/**
 * Callbacks for game asking question.
 */
rl.on("line", function(line) {
    switch (line.trim()) {
        case "exit":
            console.log("Bye!");
            process.exit(0);
            break;

        case "menu":
            menu();
            break;

        case "version":
            version();
            break;

        case "users":
            showusers();
            break;

        default:
            console.log("I don´t understand the command...");
    }
    rl.prompt();
});

rl.on("close", function() {
    console.log("Bye!");
    process.exit(0);
});

/**
 * Here comes the actual main-program.
 */
menu();
rl.setPrompt("Internetbanken$ ");
rl.prompt();

/*
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('internetbanken.sqlite');


db.serialize(() => {
//db.run("INSERT INTO User VALUES (2, 2234, 'Öskar', 'Årt', '298804131234', 'Öskargatan', 'Öskarstaden');");
    db.all("SELECT * FROM VUserAndAccount;", (err, rows) => {
        console.log(rows);
    });
});

db.close();
*/
