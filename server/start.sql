DROP DATABASE IF EXISTS Internetbanken;
CREATE DATABASE Internetbanken;

USE Internetbanken;
SET default_storage_engine=InnoDB;
SET NAMES 'utf8';

DROP PROCEDURE IF EXISTS createdatabase;

DELIMITER $$

CREATE PROCEDURE createdatabase()
BEGIN



/*
    ------------------------------------------------
    ------- Drop all tables in reverse order -------
    ------------------------------------------------
*/

-- Drop logs
DROP TABLE IF EXISTS interestLog;
DROP TABLE IF EXISTS CustomerLog;
DROP TABLE IF EXISTS BankLog;

-- Drop other tables
DROP TABLE IF EXISTS UserAccount;
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Bank;



/*
    -------------------------------------------------
    ----------- Start of Create all tables ----------
    -------------------------------------------------
*/

CREATE TABLE Bank (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    balance INTEGER,
    interestRate DECIMAL(3,2)
);


CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    pinCode INT(4) UNSIGNED ZEROFILL NOT NULL,
    civicNumber CHAR(10) UNIQUE NOT NULL, -- Format: YYMMDDXXXX
    firstName CHAR(20) NOT NULL,
    lastName CHAR(20) NOT NULL,
    street CHAR(20) NOT NULL,
    zip INT(5) UNSIGNED ZEROFILL NOT NULL,
    city CHAR(20) NOT NULL,
    phone CHAR(12) NOT NULL
);


CREATE TABLE Account (
    accountId INT AUTO_INCREMENT,
    accountNr NUMERIC(16, 0),
    balance INT,

    PRIMARY KEY (accountId, accountNr)
);


CREATE TABLE UserAccount (
    userId INT NOT NULL,
    accountId INT NOT NULL,

    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
);


CREATE TABLE CustomerLog (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    transferDate DATETIME NOT NULL,
    userId INTEGER NOT NULL,
    accountNrTo NUMERIC(16, 0) NOT NULL,
    accountNrFrom NUMERIC(16, 0) NOT NULL,
    amountSent NUMERIC(16, 3) NOT NULL,
    transferType CHAR(10),

    FOREIGN KEY (userId) REFERENCES User(userId)
);


CREATE TABLE interestLog (
    dateAddedToLog DATETIME NOT NULL,
    accountNr NUMERIC(16, 0) NOT NULL,
    interestSum NUMERIC(16, 3) NOT NULL

    -- FOREIGN KEY (accountNr) REFERENCES Account(accountNr)
);

-- End of creating tables...



/*
-------------------------------------------------
---------- Create VUserAndAccount view ----------
-------------------------------------------------
*/
DROP VIEW IF EXISTS `VUserAndAccount`;
CREATE VIEW VUserAndAccount AS
    SELECT User.firstName, User.lastName, Account.balance, User.userId, Account.accountId
    FROM UserAccount
    INNER JOIN User ON User.userId = UserAccount.userId
    INNER JOIN Account ON UserAccount.accountId = Account.accountId;
-- End of creating VUserAndAccount.

END
$$ -- End of procedure createdatabase


/*
-------------------------------------------------
------- Create procedure createNewAccount -------
-------------------------------------------------
*/

DROP PROCEDURE IF EXISTS createNewAccount$$
CREATE PROCEDURE createNewAccount(
    accountNr NUMERIC(16, 0),
    startBalance INTEGER,
    accountHolderId INTEGER
)
BEGIN

    DECLARE accountExists INTEGER;

    START TRANSACTION;

    SET accountExists = (SELECT balance FROM Account WHERE Account.accountNr LIKE accountNr);

    IF accountExists IS NOT NULL THEN
        ROLLBACK;
        SELECT "Account already exists!";
    ELSE

        INSERT INTO Account (accountNr, balance) VALUES
            (accountNr, startBalance);

        INSERT INTO UserAccount (userId, accountId) VALUES
            (accountHolderId, (SELECT MAX(accountId) FROM Account));

        SELECT "The new account has been added.";

    COMMIT;
    END IF;
END
$$



/*
-----------------------------------------------------
-- Create procedure createNewAccountToLoggedInUser --
-----------------------------------------------------
*/
DROP PROCEDURE IF EXISTS createNewAccountToLoggedInUser$$
CREATE PROCEDURE createNewAccountToLoggedInUser(
    userId INTEGER,
    pinCode INTEGER
)
BEGIN

    DECLARE newAccountNr NUMERIC(16, 0);
    DECLARE newAccountId INTEGER;

    START TRANSACTION;

    SET newAccountNr = (SELECT MAX(accountNr) FROM Account) + 111;
    SET newAccountId = (SELECT MAX(accountId) FROM UserAccount) + 1;


        -- Check if it's the correct pin code.
    IF (SELECT pinCode FROM User WHERE User.userId = userId AND User.pinCode = pinCode) IS NULL THEN
        ROLLBACK;
        SELECT "Wrong pin code!";
    ELSE

        INSERT INTO Account
        (accountNr, balance)
        VALUES
        (newAccountNr, 0);

        INSERT INTO UserAccount
        (userId, accountId)
        VALUES
        (userId, newAccountId);

    COMMIT;
    END IF;
END$$



/*
-------------------------------------------------
---------- Create procedure moveMoney -----------
-------------------------------------------------
*/

DROP PROCEDURE IF EXISTS moveMoney$$
CREATE PROCEDURE moveMoney(
    userId INTEGER,
    pinCode INTEGER,
    fromAccountNr NUMERIC(16, 0),
    amount INTEGER,
    toAccountNr NUMERIC(16, 0),
    percentToUs NUMERIC(3, 2)
)
BEGIN
    -- Quick Notes
    -- NUMERIC and DECIMAL is exactly the same.
    -- NUMERIC(8, 3) will have a numb10, 2022, 127, 1000);er of length 5 ( 8-3 ) and 3 decimals (eg. 91823.385).

    DECLARE fromAccountBalance NUMERIC(8, 3);
    DECLARE toAccountBalance NUMERIC(8, 3);

    START TRANSACTION;

    SET toAccountBalance = (SELECT balance FROM Account WHERE accountNr LIKE toAccountNr);
    SET fromAccountBalance = (SELECT balance FROM Account WHERE accountNr LIKE fromAccountNr);


    -- Check if user has access to account
    IF (SELECT accountId
        FROM UserAccount
        WHERE UserAccount.userId = userId
            AND (SELECT accountId FROM Account WHERE Account.accountNr = fromAccountNr)
    ) IS NULL THEN
        ROLLBACK;
        SELECT "User does not own this account.";


    -- Check if it's the correct pin code.
    ELSEIF (SELECT pinCode FROM User WHERE User.userId = userId AND User.pinCode = pinCode) IS NULL THEN
        ROLLBACK;
        SELECT "Wrong pin code!";


    -- Check if from account exists.
    ELSEIF fromAccountBalance IS NULL THEN
        ROLLBACK;
        SELECT "Sending account not found!";


    -- Check if to account exists.
    ELSEIF toAccountBalance IS NULL THEN
        ROLLBACK;
        SELECT "Recieving account not found!";


    -- Check if from account has enough money.
    ELSEIF fromAccountBalance - amount < 0 THEN
        ROLLBACK;
        SELECT "Amount on the account is not enough to make the transaction.";


    -- Transaction with money.
    ELSE
        -- Update recieving account balance.
        UPDATE Account
        SET
            balance = balance + (amount * (1 - percentToUs))
        WHERE
            accountNr = toAccountNr;

        -- Update sending account balance.
        UPDATE Account
        SET
            balance = balance - amount
        WHERE
            accountNr = fromAccountNr;

        -- Update bank balance.
        UPDATE Bank
        SET
            balance = balance + (amount * percentToUs)
        WHERE id LIKE 1;


        IF percentToUs = 0.03 THEN
            INSERT INTO CustomerLog (transferDate, userId, accountNrTo, accountNrFrom, amountSent, transferType) VALUES (
                NOW(), userId, toAccountNr, fromAccountNr, amount, "Webservice"
            );
        ELSE
            INSERT INTO CustomerLog (userId, userId, accountNrTo, accountNrFrom, amountSent, transferType) VALUES (
                NOW(), userId, toAccountNr, fromAccountNr, amount, "Swish"
            );
        END IF;

        COMMIT;

    END IF;

    -- Uncomment for debugging...
    -- SELECT fromAccountBalance AS FromAccount, toAccountBalance AS ToAccount, (amount * percentToUs) AS BankRecieved;

END
$$ -- End of procedure moveMoney



/*
-------------------------------------------------
---------- Create procedure moveMoneySwish ----------
-------------------------------------------------
*/

DROP PROCEDURE IF EXISTS moveMoneySwish$$
CREATE PROCEDURE moveMoneySwish(
    userId INTEGER,
    pinCode INTEGER,
    fromAccountNr NUMERIC(16,0),
    amount INTEGER,
    toAccountNr NUMERIC(16,0)
)
BEGIN
    CALL moveMoney(userId, pinCode, fromAccountNr, amount, toAccountNr, 0.05);
END
$$ -- End of procedure moveMoneySwish


/*
-------------------------------------------------
--------- Create procedure moveMoneyWeb ---------
-------------------------------------------------
*/

DROP PROCEDURE IF EXISTS moveMoneyWeb$$
CREATE PROCEDURE moveMoneyWeb(
    userId INTEGER,
    pinCode INTEGER,
    fromAccountNr NUMERIC(16,0),
    amount INTEGER,
    toAccountNr NUMERIC(16,0)
)
BEGIN
    CALL moveMoney(userId, pinCode, fromAccountNr, amount, toAccountNr, 0.03);
END
$$ -- End of procedure moveMoneyWeb


/*
-------------------------------------------------
---------- Create procedure calculateInterest ----------
-------------------------------------------------
*/
DROP PROCEDURE IF EXISTS calculateInterest$$
CREATE PROCEDURE calculateInterest(
    accountNr INTEGER,
    interestSum NUMERIC(16, 3)
)
BEGIN
    INSERT INTO interestLog (dateOfCalculation, accountNr, interestSum)
        VALUES (NOW(), accountNr, ((SELECT interestRate FROM Bank WHERE id=1) * balance / 365));
END
$$

/*
DROP PROCEDURE IF EXISTS calculateInterest$$
CREATE PROCEDURE calculateInterest(
)
BEGIN
    DECLARE currentDate CHAR(10);
    DECLARE counter INT;
    DECLARE max INT;
    SET max = (SELECT MAX(id) FROM interestLog);
    SET counter = 1;
    SET currentDate = CURDATE();

    ALTER TABLE interestLog
    ADD currentDate INT;
    forEveryAccount: LOOP
    IF counter > max THEN
    LEAVE forEveryAccount;
    END IF;
    SET counter = counter + 1;
    UPDATE interestLog
        SET
            currentDate = (SELECT balance FROM Account WHERE id = counter) * (SELECT interest FROM Bank WHERE id = 1)
        WHERE
            id = counter;

    ITERATE forEveryAccount;
    END LOOP;

END
$$ -- End of procedure calculateInterest
/*
-------------------------------------------------
--------- Procedure to fill the database --------
-------------------------------------------------
*/

DROP PROCEDURE IF EXISTS filldatabase$$
CREATE PROCEDURE filldatabase()
BEGIN



INSERT INTO Bank
    (balance, interestRate)
VALUES (0, 1.45);



INSERT INTO User
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
    (6474, '8402070026', 'Daniela', 'Hansson', 'Morvall Färilavägen 50', 82044, 'TALLÅSEN', '466576424420');



INSERT INTO Account
    (accountNr, balance)
VALUES
    ('5285415127177850', 1000),
    ('5379026026843638', 1000),
    ('4556888485452823', 1000),
    ('4485008559351951', 1000),
    ('4929160689171173', 1000),
    ('4485833035399658', 1000),
    ('4532500237478092', 1000),
    ('5321570040216486', 1000),
    ('5521863023006539', 1000),
    ('4556658461192275', 1000),
    ('4556526957179207', 1000),
    ('4916354791700657', 1000),
    ('4539430653774191', 1000),
    ('4916417118182022', 1000),
    ('5296459010695203', 1000),
    ('4532870059135702', 1000),
    ('4916678674933740', 1000),
    ('5217858613379816', 1000),
    ('5301348860764131', 1000),
    ('4556884132140424', 1000),
    ('4929127317239714', 1000);

INSERT INTO interestLog
	(accountNr)
VALUES
	('5285415127177850'),
    ('5379026026843638'),
    ('4556888485452823'),
    ('4485008559351951'),
    ('4929160689171173'),
    ('4485833035399658'),
    ('4532500237478092'),
    ('5321570040216486'),
    ('5521863023006539'),
    ('4556658461192275'),
    ('4556526957179207'),
    ('4916354791700657'),
    ('4539430653774191'),
    ('4916417118182022'),
    ('5296459010695203'),
    ('4532870059135702'),
    ('4916678674933740'),
    ('5217858613379816'),
    ('5301348860764131'),
    ('4556884132140424'),
    ('4929127317239714');

INSERT INTO UserAccount
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
    (10, 13);



END
$$ -- End of procedure filldatabase



DELIMITER ;

CALL createdatabase;
CALL filldatabase;
/*
SELECT * FROM Account;
SELECT * FROM UserAccount;
CALL createNewAccountToLoggedInUser(15, 1395);
SELECT * FROM Account;
SELECT * FROM UserAccount;
*/

-- EXTRAS
