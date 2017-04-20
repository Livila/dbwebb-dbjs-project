#!/usr/bin/env node
"use strict";
const express = require('express');
const router = express.Router();
const database = require('../dbstartup.js');

router.post("/", (request, resolve) => {
    var data = {};
    data.title = `Startsida`;
    data.message = ``;
    data.sql = `
    SELECT
    firstName, lastName
    FROM
        User
    WHERE
        userId LIKE '${request.body.userid}' AND pinCode LIKE '${request.body.usercode}';
    `;
    database.sqlpromise(data.sql)
    .then((result) => {
        if (result.length) {
            data.object = {
                name: result[0].firstName + " " + result[0].lastName,
                userid: request.body.userid,
                usercode: request.body.usercode,
                code: "200"
            }
        }
    });
    data.sql = `
    SELECT Account.accountNr AS accnr, Account.balance AS balance
    FROM UserAccount
    INNER JOIN User ON User.userId = UserAccount.userId
    INNER JOIN Account ON UserAccount.accountId = Account.accountId
    WHERE User.userId LIKE ${request.body.userid};
    `;
    /*
    */
    database.sqlpromise(data.sql)
    .then((result) => {
        if (result.length) {
            data.resultset = result;
        }
        //console.log(request.body);
        console.log(data.object);
        resolve.render("startpage", data);
    });
});
router.get("/", (request, resolve) => {
        resolve.redirect("/login");
});
module.exports = router;
