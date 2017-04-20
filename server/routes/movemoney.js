"use strict";
const express = require('express');
const router = express.Router();
const database = require('../dbstartup.js');

router.post("/", (request, resolve) => {
    console.log(request.body);
    if (request.body.code === "200") {
        var data = {};
        data.object = {
            userid: request.body.userid,
            usercode: request.body.usercode,
            code: request.body.code,
            fromaccountnr: request.body.fromaccountnr,
            toaccountnr: request.body.toaccountnr,
            amount: request.body.amount
        };
        data.sql = `
        CALL moveMoney(${request.body.userid}, ${request.body.usercode}, ${request.body.fromaccountnr}, ${request.body.amount}, ${request.body.toaccountnr});
        `;
        database.sqlpromise(data.sql)
        .then((result) => {
            resolve.render("movemoney", data);
        });

    }
    else if (request.body.code === 300) {

    }
});
module.exports = router;
