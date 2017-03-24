#!/usr/bin/env node

'use strict';

const cli = require('./cli');
const menu = require('./menu');

var options = cli.checkOptionsArguments();

console.log('Starting up the menu...');
menu.mainLoop(options);
