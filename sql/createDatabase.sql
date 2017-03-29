DROP DATABASE IF EXISTS Internetbanken;
CREATE DATABASE Internetbanken;

-- Myisam eller InnoDB eller ingen skillnad

USE Internetbanken;
SET NAMES 'utf8';

CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    pinCode INT(4) UNSIGNED ZEROFILL NOT NULL,
-- Format: YYMMDDXXXX
    civicNumber CHAR(10) UNIQUE NOT NULL,
    firstName CHAR(20) NOT NULL,
    lastName CHAR(20) NOT NULL,
    street CHAR(30) NOT NULL,
    zip INT(5) UNSIGNED ZEROFILL NOT NULL,
    city CHAR(20) NOT NULL,
    phone CHAR(12)
);

CREATE TABLE Account (
    accountId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    accountNr CHAR(16) NOT NULL,
    expireMonth INT(2),
    expireYear INT(4),
    accountCVC INT(3) UNSIGNED ZEROFILL,
    balance INT
);

CREATE TABLE UserAccount (
    userId INT NOT NULL,
    accountId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
);

-- Create view
CREATE VIEW VUserAndAccount AS
SELECT User.firstName, User.lastName, Account.balance, User.userId, Account.accountId
FROM UserAccount
INNER JOIN User ON User.userId = UserAccount.userId
INNER JOIN Account ON UserAccount.accountId = Account.accountId;
