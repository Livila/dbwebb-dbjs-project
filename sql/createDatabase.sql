DROP DATABASE IF EXISTS Internetbanken;
CREATE DATABASE Internetbanken;

USE Internetbanken;
SET default_storage_engine=InnoDB;
SET NAMES 'utf8';

DELIMITER $$

DROP PROCEDURE IF EXISTS `createdatabase`$$
CREATE PROCEDURE `createdatabase` ()
BEGIN


-- Drop tables in reverse order.
DROP TABLE IF EXISTS `UserAccount`;
DROP TABLE IF EXISTS `Account`;
DROP TABLE IF EXISTS `User`;

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
    phone CHAR(12) UNIQUE
);

CREATE TABLE Account (
    accountId INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    accountNr CHAR(9) NOT NULL,
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
DROP VIEW IF EXISTS `VUserAndAccount`;
CREATE VIEW VUserAndAccount AS
    SELECT User.firstName, User.lastName, Account.balance, User.userId, Account.accountId
    FROM UserAccount
    INNER JOIN User ON User.userId = UserAccount.userId
    INNER JOIN Account ON UserAccount.accountId = Account.accountId;

END$$ -- End of procedure createdatabase

-- move money procedure 
-- sheck if work


DROP PROCEDURE moveMoney;

DELIMITER //

CREATE PROCEDURE moveMoney(
	-- userId  INT,
	-- usercode INT,
	from_accountnr INT,
	amount NUMERIC(4, 2),
	to_accountnr INT,
    percentToUs NUMERIC(4,2)
)
 
BEGIN
	DECLARE currentBalance NUMERIC(4, 2);
    DECLARE toAccountStatus NUMERIC(4, 2);
    
    START TRANSACTION;
	
    SET toAccountStatus = (SELECT balance FROM Account WHERE accountNr = to_accountnr);
	SET currentBalance = (SELECT balance FROM Account WHERE accountNr = from_accountnr);
	
    SELECT currentBalance, toAccountStatus;
	-- SELECT toAccountStatus;

	IF (currentBalance - amount) < 0 THEN
		ROLLBACK;
        SELECT "Amount on the account is not enough to make transaction.";
        
    ELSEIF toAccountStatus = NULL  THEN
		ROLLBACK;
        SELECT "Resiving account not found";
    ELSE 
		CALL MoveMoney2(from_accountnr, amount, to_accountnr, percentToUs);

    END IF;
	
    -- SELECT * FROM Account;
END 

//

DELIMITER ;

DROP PROCEDURE MoveMoney2;

DELIMITER //

CREATE PROCEDURE MoveMoney2(
	-- userId  INT,
	-- usercode INT,
	from_accountnr INT,
	amount NUMERIC(4, 2),
	to_accountnr INT,
    percentToUs NUMERIC(4, 2)
)
 
BEGIN
	
    
		
	UPDATE Account 
		SET
			balance = balance + (amount * (1 - percentToUs)) 
		WHERE
			accountNr = to_accountnr;
	
	UPDATE Account
        SET
			balance = balance + (amount * percentToUs)
		WHERE 
			accountId = 1;
            
	UPDATE Account 
		SET
			balance = balance - amount
		WHERE
			accountNr = from_accountnr;
			
		COMMIT;

END

//

DELIMITER ;


--switch money with the help of moveMoney procedure

DROP PROCEDURE swichMoney;

DELIMITER //

CREATE PROCEDURE swichMoney(
	-- userId  INT,
	-- usercode INT,
	from_accountnr INT,
	amount NUMERIC(4, 2),
	to_accountnr INT
)
 
BEGIN

CALL moveMoney(from_accountnr, amount, to_accountnr, 0.05);

END

//

DELIMITER ;

--move money with the web interface with the help of moveMoney procedure

DROP PROCEDURE webMoveMoney;

DELIMITER //

CREATE PROCEDURE webMoveMoney(
	-- userId  INT,
	-- usercode INT,
	from_accountnr INT,
	amount NUMERIC(4, 2),
	to_accountnr INT
)
 
BEGIN

CALL moveMoney(from_accountnr, amount, to_accountnr, 0.03);

END

//

DELIMITER ;

DROP PROCEDURE IF EXISTS `filldatabase`$$
CREATE PROCEDURE `filldatabase` ()
BEGIN

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
    (accountNr, expireMonth, expireYear, accountCVC, balance)
VALUES
    ('528541516', 11, 2018, 135, 0),
    ('537902605', 2, 2020, 200, 0),
    ('455688844', 2, 2019, 603, 0),
    ('448500853', 7, 2020, 573, 0),
    ('492916062', 2, 2022, 010, 0),
    ('448583311', 11, 2018, 657, 0),
    ('453250010', 2, 2020, 401, 0),
    ('532157009', 1, 2018, 693, 0),
    ('552186308', 10, 2020, 531, 0),
    ('455665847', 8, 2019, 235, 0),
    ('455652696', 5, 2019, 095, 0),
    ('491635475', 6, 2019, 045, 0),
    ('453943064', 7, 2018, 087, 0),
    ('491641743', 5, 2022, 277, 0),
    ('529645901', 6, 2022, 489, 0),
    ('453287001', 1, 2021, 384, 0),
    ('491667862', 10, 2020, 744, 0),
    ('521785861', 6, 2021, 936, 0),
    ('530134881', 8, 2019, 643, 0),
    ('455688411', 1, 2022, 578, 0),
    ('492912731', 10, 2022, 127, 0);

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

END$$ -- End of procedure filldatabase

DELIMITER ;

CALL createdatabase;
CALL filldatabase;
