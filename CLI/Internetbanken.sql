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

INSERT INTO User
(pinCode, civicNumber, firstName, lastName, street, city)
VALUES
(1234, '198804131234', 'Oskar', 'Art', 'Oskargatan', 'Oskarstaden'),
(1234, '198906131111', 'Olle', 'Art', 'Oskargatan', 'Oskarstaden');

INSERT INTO Account
(accountNr, balance)
VALUES
('1234567812345678', 0),
('1130491238512304', 0);

INSERT INTO UserAccount
(userId, accountId)
VALUES
(1, 1),
(2, 2),
(1, 2);

CREATE VIEW VUserAndAccount AS
SELECT User.firstName as firstName, User.lastName AS lastName, Account.balance AS balance, Account.accountId AS accountId FROM UserAccount
INNER JOIN User ON User.userId = UserAccount.userId
INNER JOIN Account ON UserAccount.accountId = Account.accountId;

