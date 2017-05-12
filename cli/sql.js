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
    // Connecting to the database.
    connection = mysql.createConnection({
        host: databaseConnOpt.host,
        port: databaseConnOpt.port,
        user: databaseConnOpt.user,
        password: databaseConnOpt.password,
        database: databaseConnOpt.database
    });

    return new Promise((resolve, reject) => {
        connection.connect(function (err) {
            if (err) {
                reject(err);
            }

            resolve();
        });
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
        connection.query(sql, (err) => {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
}

function ask(readlineInterface, question) {
    return new Promise((resolve) => {
        readlineInterface.question(question, function (answer) {
            resolve(answer);
        });
    });
}

sql.resetDatabase = () => {
    var sql = [
        'CALL createdatabase;'
    ];

    sql.forEach(function (value) {
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

    sql.forEach(function (value) {
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
    return new Promise((resolve) => {
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
        });
    });
};

/*
 * Move money using the web interface
 */
sql.moveMoneyWeb = (ri) => {
    return new Promise((resolve) => {
        var userId, pinCode, fromAccountNr, amount, toAccountNr;

        ask(ri, "Enter User Id: ").then((answer) => {
            userId = answer;
        }).then(() => {
            ask(ri, "Enter Pin Code: ").then((answer) => {
                pinCode = answer;
            }).then(() => {
                ask(ri, "Enter the account to transfer from: ").then((answer) => {
                    fromAccountNr = answer;
                }).then(() => {
                    ask(ri, "Enter the amount you want to transfer: ").then((answer) => {
                        amount = answer;
                    }).then(() => {
                        ask(ri, "Enter the account to transfer to: ").then((answer) => {
                            toAccountNr = answer;
                        }).then(() => {
                            resolve(sqlPromise(`CALL moveMoneyWeb(${userId}, ${pinCode}, ${fromAccountNr}, ${amount}, ${toAccountNr});`)
                                .catch((err) => {
                                    console.log("Something went wrong... " + err);
                                }));
                        });
                    });
                });
            });
        });
    });
};

/*
 * Move money using the Swish interface
 */
sql.moveMoneySwish = (ri) => {
    return new Promise((resolve) => {
        var userId, pinCode, fromAccountNr, amount, toAccountNr;

        ask(ri, "Enter User Id: ").then((answer) => {
            userId = answer;
        }).then(() => {
            ask(ri, "Enter Pin Code: ").then((answer) => {
                pinCode = answer;
            }).then(() => {
                ask(ri, "Enter the account to transfer from: ").then((answer) => {
                    fromAccountNr = answer;
                }).then(() => {
                    ask(ri, "Enter the amount you want to transfer: ").then((answer) => {
                        amount = answer;
                    }).then(() => {
                        ask(ri, "Enter the account to transfer to: ").then((answer) => {
                            toAccountNr = answer;
                        }).then(() => {
                            resolve(sqlPromise(`CALL moveMoneySwish(${userId}, ${pinCode}, ${fromAccountNr}, ${amount}, ${toAccountNr});`)
                                .catch((err) => {
                                    console.log("Something went wrong... " + err);
                                }));
                        });
                    });
                });
            });
        });
    });
};

/*
 * Add a new user
*/
sql.addUser = (ri) => {
    return new Promise((resolve) => {
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
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

/*
 * Add a new account and connect it to a user id
 */
sql.addAccount = (ri) => {
    return new Promise((resolve) => {
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
                        }));
                });
            });
        });
    });
};

/*
 * Connect a user to an account
*/
sql.connectUserToAccount = (ri) => {
    return new Promise((resolve) => {
        var accountHolderId, accountId;

        ask(ri, "Enter User Id: ").then((answer) => {
            accountHolderId = answer;
        }).then(() => {
            ask(ri, "Enter Account Id: ").then((answer) => {
                accountId = answer;
            }).then(() => {
                resolve(sqlPromise(`CALL connectAccountHolderToAccount(${accountHolderId}, ${accountId});`)
                    .catch((err) => {
                        console.log("Something went wrong... " + err);
                    }));
            });
        });
    });
};

/**
 * Display the interest for each account
 */
sql.calculateAllInterests = () => {
    return sqlPromise('CALL calculateAllInterests');
};

/**
 * Display the interest for one account
 */
sql.calculateInterest = (ri) => {
    return new Promise((resolve) => {
        var dateOfCalculation, accountNr, interest;

        ask(ri, "Enter Date Of Calculation: ").then((answer) => {
            dateOfCalculation = answer;
        }).then(() => {
            ask(ri, "Enter Account Nr: ").then((answer) => {
                accountNr = answer;
            }).then(() => {
                ask(ri, "Enter The Interest Rate: ").then((answer) => {
                    interest = answer;
                }).then(() => {
                    resolve(sqlPromise(`CALL calculateInterest(${dateOfCalculation}, ${accountNr}, ${interest})`))
                        .then(() => {
                            console.log("OK!");
                        })
                        .catch((err) => {
                            console.log("Something went wrong... " + err);
                        });
                });
            });
        });
    });
};

/**
 * Display the accumulated interest for each account
 */
sql.showAllAccumulatedInterests = () => {
    var sql = `SELECT *, SUM(interestSum) AS sum FROM InterestLog GROUP BY accountNr;`;

    var prettyPrint = (res) => {
        res.forEach((row) => {
            console.log(`${row.dateOfCalculation}: ${row.accountNr} ${row.sum}kr`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Display the accumulated interest one account
 */
sql.showAccumulatedInterest = (ri) => {
    return new Promise((resolve) => {
        var accountNr;

        ask(ri, "Enter Account Nr: ").then((answer) => {
            accountNr = answer;
        }).then(() => {
            var sql = `SELECT dateOfCalculation, accountNr, SUM(interestSum) AS sum FROM InterestLog GROUP BY accountNr WHERE accountNr = ${accountNr};`;
            var prettyPrint = (res) => {
                res.forEach((row) => {
                    console.log(`${row.dateOfCalculation}: ${accountNr} ${row.sum}kr`);
                });
            };

            resolve(queryPromise(sql, prettyPrint));
        });
    });
};

/**
 * Display show log
 */
sql.showLog = (ri) => {
    return new Promise((resolve) => {
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
                res.forEach((row) => {
                    if (respond == '1') {
                        console.log(`${row.dateOfCalculation} - ${row.id}: ${row.accountNr} ${row.interestSum}kr interest`);
                    } else if (respond == '2') {
                        console.log(`${row.transferDate} - ${row.transferType}
${row.userId} sent ${row.amountSent}kr from ${row.accountNrTo} to ${row.accountNrFrom}`);
                    }
                });
            };

            resolve(queryPromise(sql, prettyPrint));
        });
    });
};

/**
 * Display bank information
 */
sql.showBank = () => {
    var sql = `
SELECT * FROM Bank;
;`;

    var prettyPrint = (res) => {
        res.forEach((row) => {
            console.log(`The bank has ${row.balance}kr and the interest rate is ${row.interestRate}.`);
        });
    };

    return queryPromise(sql, prettyPrint);
};



/**
 * Export module
 */
module.exports = sql;
