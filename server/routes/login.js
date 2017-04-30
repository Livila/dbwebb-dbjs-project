#!/usr/bin/env node
"use strict";
const express = require("express");
const router = express.Router();

router.get("/", (request, resolve) => {
    var data = {};
    data.title = `Logga in`;
    data.message = `Vänligen skriv in dina användareuppgifter nedanför`;
    data.object = {
        code: "100"
    };
    resolve.render("login", data);
});
module.exports = router;
