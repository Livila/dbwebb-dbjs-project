#!/usr/bin/env node
"use strict";
const server = require('./server.js'); // jshint ignore:line
const database = require('./dbstartup.js');
const cli = require('../cli/cli.js');
var cliOptions = cli.checkOptionsArguments();
database.startup(cliOptions.databaseConnOpt);

