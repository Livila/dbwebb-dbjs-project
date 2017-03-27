'use strict';

var cli = {};
const VERSION = '1.0';
const path = require('path');
var databaseConnOpt = {
    "host":"localhost",
    "port":"3306",
    "user":"root",
    "password":"",
    "database":"Internetbanken"
};

var usage = () => {
    var scriptName = path.basename(process.argv[1]);

    console.log(`Usage: ./${scriptName} [options]

Options:
   -h, --help                       Display help text.
   -v, --version                    Display the version.
   --host [string]                  Set the host. Default is '${databaseConnOpt.host}'.
   --port [number]                  Set the port. Default is '${databaseConnOpt.port}'.
   --user [string]                  Set the user. Default is '${databaseConnOpt.user}'.
   --password [string]              Set the password. Default is ${databaseConnOpt.password == '' ? 'NO password' : "'" + databaseConnOpt.host + "'"}.
   --database [string]              Set the database. Default is '${databaseConnOpt.database}'.
`);
};

var version = () => {
    console.log(VERSION);
};

var unknownOption = (arg) => {
    console.log(`Unknown option: ${arg}
Use --help to get an overview of all commands.`);
};

cli.checkOptionsArguments = () => {
    var args = process.argv.slice(2);

    args.forEach((arg, index, array) => {
        switch (arg) {
            case "-h":
            case "--help":
                usage();
                process.exit(0);
            break;

            case "-v":
            case "--version":
                version();
                process.exit(0);
            break;

            case "--host":
                databaseConnOpt.host = array[index + 1];
            break;

            case "--port":
                databaseConnOpt.port = array[index + 1];
            break;

            case "--user":
                databaseConnOpt.user = array[index + 1];
            break;

            case "--password":
                databaseConnOpt.password = array[index + 1];
            break;

            case "--database":
                databaseConnOpt.database = array[index + 1];
            break;

            default:
                if (arg.startsWith("-")) {
                    unknownOption(arg);
                    process.exit(1);
                }
            break;
        }
    });

    // What's returned to index.js.
    return { databaseConnOpt, VERSION };
};

module.exports = cli;
