'use strict';

var sql = {};

var mysql = require('mysql');
var connection;

/**
 * Initialize SQL and open a connection.
 *
 * @param options Array of database information for connecting.
 */
sql.init = (databaseConnOpt) => {
    console.log(`Using current database settings:
  Host              ${databaseConnOpt.host}
  Port              ${databaseConnOpt.port}
  User              ${databaseConnOpt.user}
  Password          ${databaseConnOpt.password == '' ? 'NO password' : '********'}
  Database          ${databaseConnOpt.database}`);

    console.log();
    console.log('Connecting to the database...');

    connection = mysql.createConnection({
        host: databaseConnOpt.host,
        port: databaseConnOpt.port,
        user: databaseConnOpt.user,
        password: databaseConnOpt.password,
        database: databaseConnOpt.database });

    return new Promise((resolve, reject) => {
            connection.connect(function(err) {
            if (err) {
                reject(err);
            }

            resolve();
        })
    });
};

/**
 * End the SQL connection.
 */
sql.end = () => {
    console.log('Closing the connection...');
    connection.end();
    console.log('Connection closed.');
};

/**
 * Use Promise to print text in order. Prompt not being in the middle of the query.
 */
function queryPromise(sql, prettyPrint) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            if (err) {
                reject(err);
            }

            prettyPrint(res);
            resolve();
        });
    });
}

sql.resetDatabase = () => {
    var sql = [
        "DROP DATABASE IF EXISTS Internetbanken;",
        "CREATE DATABASE Internetbanken;",
        "USE Internetbanken;",
        "SET NAMES 'utf8';",
        `CREATE TABLE User (
            userId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            pinCode INT(4) UNSIGNED ZEROFILL NOT NULL,
            civicNumber CHAR(10) UNIQUE NOT NULL,
            firstName CHAR(20) NOT NULL,
            lastName CHAR(20) NOT NULL,
            street CHAR(30) NOT NULL,
            zip INT(5) UNSIGNED ZEROFILL NOT NULL,
            city CHAR(20) NOT NULL,
            phone CHAR(12)
        );`,
        `CREATE TABLE Account (
            accountId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            accountNr CHAR(16) NOT NULL,
            expireMonth INT(2),
            expireYear INT(4),
            accountCVC INT(3) UNSIGNED ZEROFILL,
            balance INT
        );`,
        `CREATE TABLE UserAccount (
            userId INT NOT NULL,
            accountId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES User(userId),
            FOREIGN KEY (accountId) REFERENCES Account(accountId)
        );`,
        `CREATE VIEW VUserAndAccount AS
            SELECT User.firstName, User.lastName, Account.balance, User.userId, Account.accountId
            FROM UserAccount
                INNER JOIN User ON User.userId = UserAccount.userId
                INNER JOIN Account ON UserAccount.accountId = Account.accountId;`
    ];

    sql.forEach(function(value) {
        connection.query(value, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    console.log('Done.');
};

sql.fillDatabase = () => {
    var sql = [
        `INSERT INTO User
    (pinCode, civicNumber, firstName, lastName, street, zip, city, phone)
VALUES
    (9608, '8108222046', 'Alisa', 'Hermansson', 'Östbygatan 26', 31230, 'MELLBYSTRAND', '464306464289'),
    (5228, '5706118766', 'Emilia', 'Engström', 'Björkvägen 90', 31031, 'ELDSBERGS', '46354959724'),
    (1504, '4407109109', 'Moa', 'Pettersson', 'Hagagatan 1', 53158, 'JÄRPÅS', '46135403954'),
    (4408, '8009093934', 'Danny', 'Björk', 'Hålebäcksvägen 78', 79021, 'BJURSÅS', '462462617612'),
    (6888, '3908173036', 'Dante', 'Eliasson', 'Liljerum Grenadjärtorpet 6', 19191, 'SOLLENTUNA', '467084166363'),
    (5576, '6901296407', 'Hanna', 'Lundqvist', 'Föreningsgatan 71', 81060, 'SÖDERFORS', '462938770213'),
    (6303, '8408290032', 'Filip', 'Holmberg', 'Södra Kroksdal 64', 38570, 'BERGKVARA', '464867754747'),
    (0477, '9109019225', 'Lilian', 'Gustafsson', 'Libecksvägen 35', 71236, 'HÄLLEFORS', '465916267810'),
    (4227, '9305205016', 'Lukas', 'Gunnarsson', 'Verdandi Gränd 60', 91076, 'RISBÄCK', '469424758604'),
    (7586, '9210275408', 'Kira', 'Eriksson', 'Syrengården 88', 42540, 'HISINGS KÄRRA', '463034093116'),
    (8962, '8603164578', 'Seth', 'Abrahamsson', 'Käbbatorp Locketorp 1', 82023, 'BERGVIK', '462703832351'),
    (2417, '9802272782', 'Angela', 'Nordström', 'Mjövattnet 6', 87030, 'NORDINGRÅ', '466137446571'),
    (1800, '9402084868', 'Signe', 'Eriksson', 'Syrengården 88', 42540, 'HISINGS KÄRRA', '463093824382'),
    (0082, '9404294333', 'Victor', 'Forsberg', 'Hagag 89', 44006, 'GRÅBO', '462413413542'),
    (1395, '8808201274', 'Nicolai', 'Lindqvist', 'Föreningsgatan 26', 81060, 'SÖDERFORS', '462934141836'),
    (3368, '9101199371', 'Wiggo', 'Jansson', 'Edeforsvägen 47', 51054, 'BRÄMHULT', '46339269020'),
    (5781, '8306173421', 'Savannah', 'Göransson', 'Buanvägen 87', 87013, 'VIKSJÖ', '466117173158'),
    (8517, '8210247774', 'Kalle', 'Åström', 'Föreningsgatan 36', 74061, 'TOBO', '462958582634'),
    (1981, '8810183239', 'Manne', 'Axelsson', 'Vikarna 97', 52240, 'TIDAHOLM', '465025317852'),
    (3411, '8110126318', 'Alec', 'Norberg', 'Morvall Färilavägen 39', 82043, 'TALLÅSEN', '466518916068'),
    (6474, '8402070026', 'Daniela', 'Hansson', 'Morvall Färilavägen 50', 82044, 'TALLÅSEN', '466576424420');`,

`INSERT INTO Account
    (accountNr, expireMonth, expireYear, accountCVC, balance)
VALUES
    ('5285415127177850', 11, 2018, 135, 0),
    ('5379026026843638', 2, 2020, 200, 0),
    ('4556888485452823', 2, 2019, 603, 0),
    ('4485008559351951', 7, 2020, 573, 0),
    ('4929160689171173', 2, 2022, 010, 0),
    ('4485833035399658', 11, 2018, 657, 0),
    ('4532500237478092', 2, 2020, 401, 0),
    ('5321570040216486', 1, 2018, 693, 0),
    ('5521863023006539', 10, 2020, 531, 0),
    ('4556658461192275', 8, 2019, 235, 0),
    ('4556526957179207', 5, 2019, 095, 0),
    ('4916354791700657', 65, 2019, 045, 0),
    ('4539430653774191', 7, 2018, 087, 0),
    ('4916417118182022', 5, 2022, 277, 0),
    ('5296459010695203', 6, 2022, 489, 0),
    ('4532870059135702', 1, 2021, 384, 0),
    ('4916678674933740', 10, 2020, 744, 0),
    ('5217858613379816', 6, 2021, 936, 0),
    ('5301348860764131', 8, 2019, 643, 0),
    ('4556884132140424', 1, 2022, 578, 0),
    ('4929127317239714', 10, 2022, 127, 0);`,

`INSERT INTO UserAccount
    (userId, accountId)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10),
    (11, 11),
    (12, 12),
    (12, 3),
    (13, 13),
    (13, 3),
    (14, 14),
    (14, 3),
    (15, 15),
    (15, 10),
    (16, 16),
    (16, 10),
    (17, 17),
    (17, 10),
    (18, 18),
    (18, 10),
    (19, 19),
    (19, 7),
    (20, 20),
    (20, 7),
    (21, 21),
    (21, 7),
    (13, 10),
    (10, 13);`
];

    sql.forEach(function(value) {
        connection.query(value, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    console.log('Done.');
};

/**
 * Display users
 */
sql.showUsers = () => {

    var sql = `
SELECT * FROM VUserAndAccount ORDER BY userId;
;`;

    var prettyPrint = (res) => {
        res.forEach((row, count) => {
            console.log(`${count} [user ${row.userId}][account ${row.accountId}]: ${row.firstName} ${row.lastName} - ${row.balance}kr`);
        });
    };

    return queryPromise(sql, prettyPrint);
};

/**
 * Export module
 */
module.exports = sql;
