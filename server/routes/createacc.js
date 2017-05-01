"use strict";

const express = require('express');
const router = express.Router();
const database = require('../dbstartup.js');

router.post("/", (request, resolve) => {
    console.log(request.body);
    var data = {};
    data.object = {
        userid: request.body.userid,
        usercode: request.body.usercode,
        code: "200"
    };
    data.sql = `
    CALL createNewAccountToLoggedInUser(${request.body.userid}, ${request.body.usercode});
    `;
    database.sqlpromise(data.sql)
    .then(() => {
        resolve.render("createacc", data);
    });
});
module.exports = router;
