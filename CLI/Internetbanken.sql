DROP DATABASE IF EXISTS Internetbanken;
CREATE DATABASE Internetbanken;

-- Myisam eller InnoDB eller ingen skillnad

USE Internetbanken;
SET NAMES 'utf8';

CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    pinCode INT(4) NOT NULL,
-- YYYYMMDDXXXX
    civicNumber CHAR(12) UNIQUE NOT NULL,
    firstName CHAR(20) NOT NULL,
    lastName CHAR(20) NOT NULL,
    street CHAR(20) NOT NULL,
    city CHAR (20) NOT NULL
);

CREATE TABLE Account (
    accountId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    accountNr CHAR(16) NOT NULL,
    balance INT
);

CREATE TABLE UserAccount (
    userId INT NOT NULL,
    accountId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
);
/*
INSERT INTO User
(pinCode, civicNumber, firstName, lastName, street, city)
VALUES
(1234, 'Oskar', 'Art', '198804131234', 'Oskargatan', 'Oskarstaden'),
(1234, 'Olle', 'Art', '198906131111', 'Oskargatan', 'Oskarstaden');

INSERT INTO Account
(accountNr)
VALUES
('1234567812345678'),
('1130491238512304');

INSERT INTO UserAccount
(userId, accountId)
VALUES
(1, 1),
(2, 2),
(1, 2);
*/

INSERT INTO User VALUES (1, 1234, 'Oskar', 'Art', '198804131234', 'Oskargatan', 'Oskarstaden');
INSERT INTO User VALUES (2, 1234, 'Olle', 'Art', '198906131111', 'Oskargatan', 'Oskarstaden');

INSERT INTO Account VALUES (1, '1234567812345678', 100);
INSERT INTO Account VALUES (2, '1130491238512304', 20000);

INSERT INTO UserAccount VALUES (1, 1);
INSERT INTO UserAccount VALUES (2, 2);
INSERT INTO UserAccount VALUES (1, 2);

-- Not needed because the database is dropped and re-created.
--DROP VIEW IF EXISTS VUserAndAccount;
CREATE VIEW VUserAndAccount AS
SELECT User.firstName AS 'first name', User.lastName AS 'last name', Account.balance AS 'balance', Account.accountId AS 'account id' FROM UserAccount
INNER JOIN User ON User.userId = UserAccount.userId
INNER JOIN Account ON UserAccount.accountId = Account.accountId;
