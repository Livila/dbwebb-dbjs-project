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

    return new Promise((resolve, reject) => {
            connection.connect(function(err) {
            if (err) {
                reject(err);
            }

            resolve();
        })
    });
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
        'CALL createdatabase;'
    ];

    sql.forEach(function(value) {
        connection.query(value, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    console.log('Done.');
};

sql.fillDatabase = () => {
    var sql = [
        'CALL filldatabase;'
];

    sql.forEach(function(value) {
        connection.query(value, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    console.log('Done.');
};

/**
 * Display users
 */
sql.showUsers = () => {

    var sql = `
SELECT * FROM VUserAndAccount ORDER BY userId;
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count} [user ${row.userId}][account ${row.accountId}]: ${row.firstName} ${row.lastName} - ${row.balance}kr`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Export module
 */
module.exports = sql;
