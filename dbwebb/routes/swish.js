#!/usr/bin/env node
"use strict";
const express = require('express');
const router = express.Router();
const database = require('../dbstartup.js');

router.get("/", (request, resolve) => {
        var data = {};
        data.title = `Swish-appen`;
        data.message = `Välkommen till Swish-appen!`;
        data.code = 300;
        resolve.render("swish", data);
});
module.exports = router;
