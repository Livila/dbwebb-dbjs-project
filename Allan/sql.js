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
 * Displaying products
 */
sql.product = () => {
    console.log('Displaying products:');

    var sql = `
SELECT * FROM a_product
ORDER BY name
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count}: ${row.name}`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Displaying inventory1
 */
sql.inventory1 = () => {
    console.log('Displaying inventory1:');

    var sql = `
SELECT p.name AS name, i.number AS num
FROM a_product AS p
    INNER JOIN a_inventory AS i
        ON p.id = i.id
ORDER BY num DESC
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count}: ${row.name} ${row.num}`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Displaying inventory2
 */
sql.inventory2 = () => {
    console.log('Displaying inventory2:');

    var sql = `
SELECT p.name AS name,
    (SELECT i.number
    FROM a_inventory AS i
        WHERE p.id = i.id) AS num
FROM a_product AS p
ORDER BY num DESC
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count}: ${row.name} ${(row.num === null ? '0' : row.num)}`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Displaying supplier1
 */
sql.supplier1 = () => {
    console.log('Displaying supplier1:');

    var sql = `
SELECT p.name AS name, s.number AS num
FROM a_product AS p
    INNER JOIN a_supplier AS s
        ON p.id = s.id
ORDER BY num DESC
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count}: ${row.name} ${row.num}`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Displaying supplier2
 */
sql.supplier2 = () => {
    console.log('Displaying supplier2:');

    var sql = `
SELECT p.name AS name,
    (SELECT s.number
    FROM a_supplier AS s
        WHERE p.id = s.id) AS num
FROM a_product AS p
ORDER BY num DESC
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count}: ${row.name} ${(row.num === null ? '0' : row.num)}`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Displaying all
 */
sql.all = () => {
    console.log('Displaying all:');

    var sql = `
SELECT p.name AS name,
    (SELECT i.number
        FROM a_inventory AS i
        WHERE p.id = i.id) AS num,
    (SELECT s.number
        FROM a_supplier AS s
        WHERE p.id = s.id) AS num_s
FROM a_product AS p
ORDER BY name ASC
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count}: ${row.name} ${(row.num === null ? '0' : row.num)} ${(row.num_s === null ? '0' : row.num_s)}`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Displaying only
 */
sql.only = () => {
    console.log('Displaying only:');

    var sql = `
SELECT
    p.name AS name,
    (SELECT i.number
        FROM a_inventory AS i
        WHERE p.id = i.id) AS num_i,
    (SELECT s.number
        FROM a_supplier AS s
        WHERE p.id = s.id) AS num_s,
    sum(i.number + s.number) AS num
FROM a_product AS p, a_inventory AS i
    INNER JOIN a_supplier AS s
        ON i.id = s.id
WHERE p.id = s.id
    AND p.id = i.id
GROUP BY i.number
ORDER BY name ASC
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count}: ${row.name} ${(row.num_i === null ? '0' : row.num_i)} ${(row.num_s === null ? '0' : row.num_s)} =${(row.num === null ? '0' : row.num)}`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Export module
 */
module.exports = sql;
