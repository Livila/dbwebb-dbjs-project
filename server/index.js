#!/usr/bin/env node
"use strict";
const server = require('./server.js'); // jshint ignore:line
const database = require('./dbstartup.js')
database.startup();
/*
const dbstartup = require('./dbstartup.js');
const cli = require('./cli.js');
var optargs = cli.checkOptionsArguments();
dbstartup.startup(optargs);
*/
