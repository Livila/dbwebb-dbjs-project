'use strict';

var sql = {};

var mysql = require('mysql');
var connection;

/**
 * Initialize SQL and open a connection.
 *
 * @param options Array of database information for connecting.
 */
sql.init = (options) => {
    console.log('Using current settings:');
    console.log('  Host              ' + options.host);
    console.log('  Port              ' + options.port);
    console.log('  User              ' + options.user);
    console.log('  Database          ' + options.database);

    console.log();
    console.log('Connecting to the database...');
    connection = mysql.createConnection({
        host: options.host,
        port: options.port,
        user: options.user,
        password: options.password,
        database: options.database });

    connection.connect();
    console.log('Connected!');
};

/**
 * End the SQL connection.
 */
sql.end = () => {
    console.log("Closing the connection...");
    connection.end();
    console.log("Connection closed.");
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

/**
 * Displaying users
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
