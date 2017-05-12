#!/usr/bin/env node
"use strict";
const mysql = require("mysql");
const database = {};
var mysqlDatabase;

database.startup = (databaseConnObj) => {
    let data = {
        host     : databaseConnObj.host,
        port     : databaseConnObj.port,
        user     : databaseConnObj.user,
        password : databaseConnObj.password,
        database : databaseConnObj.database
    };
    mysqlDatabase = mysql.createConnection(data);
    //console.log(data);
    // Anslut till databasen
    mysqlDatabase.connect((err) => {
        if (err) {
            console.error("Error connecting to database.");
            process.exit(2);
        }
        console.log("CONNECTION SUCCESSFUL - Thread ID: " + mysqlDatabase.threadId);
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
