#!/usr/bin/env node
"use strict";
const express = require('express');
const router = express.Router();
const database = require('../dbstartup.js');

router.post("/", (request, resolve) => {
    if (request.body.code === "300") {
        resolve.redirect("/index");
    }
    var data = {};
    data.title = `Startsida`;
    data.message = ``;
    data.sql = `
    SELECT
    Account.accountNr,
    Account.balance,
    User.firstName,
    User.lastName
    FROM
    UserAccount
        INNER JOIN
    User ON User.userId LIKE UserAccount.userId
		INNER JOIN
	Account ON Account.accountId LIKE UserAccount.accountId
    WHERE
    User.userId LIKE '${request.body.userid}' AND User.pinCode LIKE '${request.body.usercode}';
    `;
    database.sqlpromise(data.sql)
    .then((result) => {
        if (result.length) {
            data.object = {
                firstname: result[0].firstName,
                lastname: result[0].lastName,
                userid: request.body.userid,
                usercode: request.body.usercode
            }
            data.accounts = result;
        }
    });
    data.sql = `
    SELECT
    UserAccount.userId,
    UserAccount.accountId,
    Account.accountNr,
    Account.balance,
    User.firstName,
    User.lastName,
    User.civicNumber
    FROM
    UserAccount
        INNER JOIN
    User ON User.userId LIKE UserAccount.userId
		INNER JOIN
	Account ON Account.accountId LIKE UserAccount.accountId
    WHERE
    UserAccount.accountId IN (SELECT
            UserAccount.accountId
        FROM
            UserAccount
        WHERE
            UserAccount.userId LIKE '${request.body.userid}')
    AND UserAccount.userId != '${request.body.userid}'
    ORDER BY accountId ASC;
    `;
    database.sqlpromise(data.sql)
    .then((result) => {
        if (result.length) {
            data.resultset = result;
        }
        resolve.render("startpage", data);
    });
});
router.get("/", (request, resolve) => {
        resolve.redirect("/login");
});
module.exports = router;
