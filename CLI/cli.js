'use strict';

var cli = {};
const VERSION = '1.0';
const path = require('path');
var databaseConnOpt = {
    "host":"localhost",
    "port":"3306",
    "user":"internetbanken",
    "password":"Admin!",
    "database":"Internetbanken"
};

var usage = () => {
    var scriptName = path.basename(process.argv[1]);

    console.log(`Usage: ./${scriptName} [options]

Options:
   -h, --help                       Display help text.
   -v, --version                    Display the version.
   --host [string]                  Set the host. Default is 'localhost'.
   --port [number]                  Set the port. Default is '3306'.
   --user [string]                  Set the user. Default is 'internetbanken'.
   --password [string]              Set the password. Default is Admin!.
   --database [string]              Set the database. Default is 'Internetbanken'.
`);
};

var version = () => {
    console.log(VERSION);
};

var unknownOption = (option) => {
    console.log(`Unknown option: ${option}
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

    return databaseConnOpt;
};

module.exports = cli;
