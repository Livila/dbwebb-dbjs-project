#!/usr/bin/env node

'use strict';

// Get command line arguments.
const cli = require('./cli/cli');
var cliOptions = cli.checkOptionsArguments();

const server = require('./server/server.js'); // jshint ignore:line

const dbStartup = require('./server/dbstartup.js');
dbStartup.startup(cliOptions.databaseConnOpt);

// Initialize the menu.
const menu = require('./cli/menu');
menu.mainLoop(cliOptions.databaseConnOpt, cliOptions.VERSION);
