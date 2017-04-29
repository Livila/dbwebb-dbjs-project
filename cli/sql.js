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

function sqlPromise(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
}

function ask(readlineInterface, question) {
    return new Promise((resolve, reject) => {
        readlineInterface.question(question, function(answer) {
            resolve(answer);
        });
    })
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
 * Display specific user
 */
sql.showSpecUser = (userid) => {
    var sql = `
    SELECT * FROM VUserAndAccount WHERE userId = ` + userid +
    `;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count} [user ${row.userId}][account ${row.accountId}]: ${row.firstName} ${row.lastName} - ${row.balance}kr`);
        });
    };

    return queryPromise(sql, prettyPrint);
}

/*
 *
 */
sql.moveMoney = (userId, usercode, from_accountnr, amount, to_accountnr) => {
    var sql = `
    UPDATE VUserAndAccount SET balance = balance - ` +amount + ` WHERE accountId =` + from_accountnr +
    `;
    UPDATE VUserAndAccount SET balance = balance + ` + amount + ` WHere accountId =` + to_accountnr + `;`;

    var sql2 = `
    SELECT balance FROM VUserAndAccount WHERE accountId = ` + from_account+`;`
/*
    var getIfUserHaveEnoughMoney = (res) => {
        res.forEach((row, count) => {
            var enoughMoney = `${row.balance}`

            if (enoughMoney > )
        })

    }

    var sql2 = `
    SELECT balance FROM VUserAndAccount WHERE accountId = ` + to_accountnr+`;`
    //if the sql returns null the account is inactive

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            if (err) {
                reject(err);
            }
            if ()
            prettyPrint(res);
            resolve();
        });
    });
*/
    return queryPromise(sql, prettyPrint);
}

sql.addUser = (ri) => {
    return new Promise((resolve, reject) => {
        var pinCode, civicNumber, firstName, lastName, street, zip, city, phone;

        ask(ri, "Enter Pin Code [4]: ").then((answer) => {
            pinCode = answer;
        }).then(() => {
        ask(ri, "Enter Civic Number [10]: ").then((answer) => {
            civicNumber = answer;
        }).then(() => {
        ask(ri, "Enter First Name [20]: ").then((answer) => {
            firstName = answer;
        }).then(() => {
        ask(ri, "Enter Last Name [20]: ").then((answer) => {
            lastName = answer;
        }).then(() => {
        ask(ri, "Enter Street [20]: ").then((answer) => {
            street = answer;
        }).then(() => {
        ask(ri, "Enter Zip [5]: ").then((answer) => {
            zip = answer;
        }).then(() => {
        ask(ri, "Enter City [20]: ").then((answer) => {
            city = answer;
        }).then(() => {
        ask(ri, "Enter Phone [12]: ").then((answer) => {
            phone = answer;
        }).then(() => {
            sqlPromise(`INSERT INTO User (pinCode, civicNumber, firstName, lastName, street, zip, city, phone)
                VALUES (${pinCode}, ${civicNumber}, '${firstName}', '${lastName}', '${street}', ${zip}, '${city}', ${phone});`)
            .catch((err) => {
                console.log("Something went wrong... " + err);
            });
            console.log("The new user has been added.");
        })})})})})})})})
    });
}

sql.addAccount = (ri) => {
    return new Promise((resolve, reject) => {
        var accountNr, startBalance, accountHolderId;

        ask(ri, "Enter Account Nr [16]: ").then((answer) => {
            accountNr = answer;
        }).then(() => {
        ask(ri, "Enter Start Balance [16]: ").then((answer) => {
            startBalance = answer;
        }).then(() => {
        ask(ri, "Enter user id the account belongs to: ").then((answer) => {
            accountHolderId = answer;
        }).then(() => {
            sqlPromise(`CALL createNewAccount(${accountNr}, ${startBalance}, ${accountHolderId});`)
                .catch((err) => {
                    console.log("Something went wrong... " + err);
                });
        })})})
    });
}


sql.connectUserToAccount = (ri) => {
    return new Promise((resolve, reject) => {
        var accountHolderId, accountId;

        ask(ri, "Enter User Id: ").then((answer) => {
            accountHolderId = answer;
        }).then(() => {
        ask(ri, "Enter Account Id: ").then((answer) => {
            accountId = answer;
        }).then(() => {
            sqlPromise(`CALL connectAccountHolderToAccount(${accountHolderId}, ${accountId});`)
                .catch((err) => {
                    console.log("Something went wrong... " + err);
                });
        })})
    });
}


/**
 * Export module
 */
module.exports = sql;
