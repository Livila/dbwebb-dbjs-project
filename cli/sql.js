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
            console.log(`${count} [user ${row.userId}][accId ${row.accountId}]\t${row.accountNr} - ${row.balance}kr: ${row.firstName} ${row.lastName}`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Display specific user
 */
sql.showSpecUser = (ri) => {
    return new Promise((resolve, reject) => {
        var userId;

        ask(ri, "Enter User Id: ").then((answer) => {
            userId = answer;
        }).then(() => {
            var sql = `SELECT * FROM VUserAndAccount WHERE userId = ${userId};`;

            var prettyPrint = (res) => {
                res.forEach((row, count) => {
                    console.log(`${count} [user ${row.userId}][accId ${row.accountId}]\t${row.accountNr} - ${row.balance}kr: ${row.firstName} ${row.lastName}`);
                });
            };

            resolve(queryPromise(sql, prettyPrint));
        })
    });
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

/*
 * Add a new user
*/
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
            resolve(sqlPromise(`INSERT INTO User (pinCode, civicNumber, firstName, lastName, street, zip, city, phone)
                VALUES (${pinCode}, ${civicNumber}, '${firstName}', '${lastName}', '${street}', ${zip}, '${city}', ${phone});`)
                .then(() => {
                    console.log("The new user has been added.");
                })
                .catch((err) => {
                    console.log("Something went wrong... " + err);
                }));
        })})})})})})})})
    });
}

/*
 * Add a new account and connect it to a user id
 */
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
            resolve(sqlPromise(`CALL createNewAccount(${accountNr}, ${startBalance}, ${accountHolderId});`)
                .catch((err) => {
                    console.log("Something went wrong... " + err);
                }))
        })})})
    });
}

/*
 * Connect a user to an account
*/
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
 * Display the accumulated interest for each account
 */
sql.calculateInterest = () => {
    return sqlPromise('CALL calculateInterest');
};

/**
 * Display show log
 */
sql.showLog = (ri) => {
    return new Promise((resolve, reject) => {
        var respond;

        ask(ri, "[1]Interest or [2]customer\nEnter option: ").then((answer) => {
            respond = answer;
            if (respond == '1' || respond.toLowerCase() == 'interest') {
                respond = '1';
            } else if (respond == '2' || respond.toLowerCase() == 'customer') {
                respond = '2';
            }
        }).then(() => {
            var sql;
            if (respond == '1') {
                sql = `SELECT * FROM InterestLog;`;
            } else if (respond == '2') {
                sql = `SELECT * FROM CustomerLog;`;
            }

            var prettyPrint = (res) => {
                res.forEach((row, count) => {
                    if (respond == '1') {
                        console.log(`${row.dateAddedToLog} - ${row.id}: ${row.accountNr} ${row.interestSum}kr interest`);
                    } else if (respond == '2') {
                        console.log(`${row.transferDate} - ${row.transferType}
${row.userId} sent ${row.amountSent}kr from ${row.accountNrTo} to ${row.accountNrFrom}`);
                    }
                });
            };

            resolve(queryPromise(sql, prettyPrint));
        })
    });
}

/**
 * Display bank information
 */
sql.showBank = () => {
    var sql = `
SELECT * FROM Bank;
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`The bank has ${row.balance}kr and the interest rate ${row.interestRate}.`);
        });
    };

    return queryPromise(sql, prettyPrint);
};



/**
 * Export module
 */
module.exports = sql;
