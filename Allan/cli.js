'use strict';

var cli = {};
const VERSION = '1.0';
const path = require('path');
var options = {
    "host":"localhost",
    "port":"3306",
    "user":"user",
    "password":"",
    "database":"Allan"
};

var usage = () => {
    var scriptName = path.basename(process.argv[1]);

    console.log(`Usage: ./${scriptName} [options]

Options:
   -h, --help                       Display help text.
   -v, --version                    Display the version.
   --host [string]                  Set the host. Default is 'localhost'.
   --port [number]                  Set the port. Default is '3306'.
   -u, --user [string]              Set the user. Default is 'user'.
   -p, --password [string]          Set the password. Default is NO password.
   -d, --database [string]          Set the database. Default is 'Allan'.
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
                options.host = array[index + 1];
            break;
            case "--port":
                options.port = array[index + 1];
            break;
            case "-u":
            case "--user":
                options.user = array[index + 1];
            break;
            case "-p":
            case "--password":
                options.password = array[index + 1];
            break;
            case "-d":
            case "--database":
                options.database = array[index + 1];
            break;
            default:
                if (arg.startsWith("-")) {
                    unknownOption(arg);
                    process.exit(1);
                }
            break;
        }
    });

    return options;
};

module.exports = cli;
