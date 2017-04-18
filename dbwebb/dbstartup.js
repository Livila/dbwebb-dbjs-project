#!/usr/bin/env node
"use strict";
const mysql = require("mysql");
const database = {};
var mysqlDatabase;

database.startup = (optionsArg) => {
    let data = {
        host     : "127.0.0.1", /* `127.0.0.1` */
        user     : "root",
        password : "",
        database : "internetbanken"
    }
    mysqlDatabase = mysql.createConnection(data);
    console.log(data);
    //koppla mig till databasen
    mysqlDatabase.connect((err) => {
        if (err) {
            console.error("Error connecting to database.");
            process.exit(2);
        }
        console.log("CONNECTION SUCCESSFUL - ID: " + mysqlDatabase.threadId);
    });
};
database.sqlpromise = (sql) => {
    return new Promise((resolve, reject) => {
        mysqlDatabase.query(sql, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};
module.exports = database;
