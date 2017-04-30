#!/usr/bin/env node
"use strict";

const express = require('express');
const router = express.Router();
require('../dbstartup.js');

router.get("/", (request, resolve) => {
    var data = {};
    data.title = `Swish-appen`;
    data.message = `Välkommen till Swish-appen!`;
    resolve.render("swish", data);
});
module.exports = router;
