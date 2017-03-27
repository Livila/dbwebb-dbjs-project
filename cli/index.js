#!/usr/bin/env node

'use strict';

// Get command line arguments.
const cli = require('./cli');
var cliOptions = cli.checkOptionsArguments();

// Initialize the menu.
const menu = require('./menu');
menu.mainLoop(cliOptions.databaseConnOpt, cliOptions.VERSION);
