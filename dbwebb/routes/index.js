#!/usr/bin/env node
"use strict";
const express = require("express");
const router = express.Router();

router.get("/", (request, resolve) => {
    var data = {};
    data.title = `Internetbanken`;
    data.message = `Välkommen till Internetbanken!`;
    resolve.render("index", data);
});
module.exports = router;
