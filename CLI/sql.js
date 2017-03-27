'use strict';

var sql = {};

var mysql = require('mysql');
var connection;

/**
 * Initialize SQL and open a connection.
 *
 * @param options Array of database information for connecting.
 */
sql.init = (databaseConnOpt) => {
    console.log(`Using current database settings:
  Host              ${databaseConnOpt.host}
  Port              ${databaseConnOpt.port}
  User              ${databaseConnOpt.user}
  Password          ${databaseConnOpt.password == '' ? 'NO password' : '********'}
  Database          ${databaseConnOpt.database}`);

    console.log();
    console.log('Connecting to the database...');
    connection = mysql.createConnection({
        host: databaseConnOpt.host,
        port: databaseConnOpt.port,
        user: databaseConnOpt.user,
        password: databaseConnOpt.password,
        database: databaseConnOpt.database });

    connection.connect();
    console.log('Connected!');
};

/**
 * End the SQL connection.
 */
sql.end = () => {
    console.log('Closing the connection...');
    connection.end();
    console.log('Connection closed.');
};

/**
 * Use Promise to print text in order. Prompt not being in the middle of the query.
 */
function queryPromise(sql, prettyPrint) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            if (err) {
                reject(err);
            }

            prettyPrint(res);
            resolve();
        });
    });
}

sql.resetDatabase = () => {
    var sql = [
        "DROP DATABASE IF EXISTS Internetbanken;",
        "CREATE DATABASE Internetbanken;",
        "USE Internetbanken;",
        "SET NAMES 'utf8';",
        `CREATE TABLE User (
            userId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            pinCode INT(4) NOT NULL,
            civicNumber CHAR(12) UNIQUE NOT NULL,
            firstName CHAR(20) NOT NULL,
            lastName CHAR(20) NOT NULL,
            street CHAR(20) NOT NULL,
            city CHAR (20) NOT NULL
        );`,
        `CREATE TABLE Account (
            accountId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            accountNr CHAR(16) NOT NULL,
            balance INT
        );`,
        `CREATE TABLE UserAccount (
            userId INT NOT NULL,
            accountId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES User(userId),
            FOREIGN KEY (accountId) REFERENCES Account(accountId)
        );`
    ];

    sql.forEach(function(value) {
        connection.query(value, (err) => {
            console.log(err);
        });
    });

    console.log('Done.');
};

sql.fillDatabase = () => {
    var sql = [
        `INSERT INTO User
            (pinCode, civicNumber, firstName, lastName, street, city)
        VALUES
            (1234, 'Oskar', 'Art', '198804131234', 'Oskargatan', 'Oskarstaden'),
            (1234, 'Olle', 'Art', '198906131111', 'Oskargatan', 'Oskarstaden');`,
        `INSERT INTO Account
            (accountNr)
        VALUES
            ('1234567812345678'),
            ('1130491238512304');`,
        `INSERT INTO UserAccount
            (userId, accountId)
        VALUES
            (1, 1),
            (2, 2),
            (1, 2);`
    ];

    sql.forEach(function(value) {
        connection.query(value, (err) => {
            console.log(err);
        });
    });

    console.log('Done.');
};

/**
 * Display users
 */
sql.showUsers = () => {

    var sql = `
SELECT * FROM VUserAndAccount
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count}: ${row.firstName} - ${row.balance}`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Export module
 */
module.exports = sql;
