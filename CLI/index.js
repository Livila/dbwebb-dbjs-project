#!/usr/bin/env node

'use strict';

const VERSION = "1.0.0";

var mysql      = require("mysql");
var connection = mysql.createConnection({
    host     : "localhost",
    user     : "internetbanken",
    password : "Admin!",
    database : "Internetbanken"
});

var path = require('path');
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);

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
    console.log(`Use any of the commands: `);
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
            console.log("I don´t understand");
    }
    rl.prompt();
});

rl.on("close", function() {
    console.log("Bye!");
    process.exit(0);
});



// Walkthrough all arguments checking for options.
var remaining = [];
args.forEach((arg) => {
    switch (arg) {
        case '-h':
            usage();
            process.exit(0);
            break;

        case '-v':
            version();
            process.exit(0);
            break;

        default:
            remaining.push(arg);
            break;
    }
});

var min, max, number;

// Check if there is remaining arguments that should be used for min and max
if (remaining.length >= 2) {
    min = parseInt(remaining[0], 10);
    max = parseInt(remaining[1], 10);
} else if (remaining.length === 1) {
    min = parseInt(remaining[0], 10);
}

number = Math.floor((Math.random() * max) + min);



/**
 * Here comes the actual main-program.
 */
console.log("I am thinking of a number between " + min + " and " + max);
rl.setPrompt("Guess my number$ ");
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
