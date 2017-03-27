USE Internetbanken

INSERT INTO User
    (pinCode, civicNumber, firstName, lastName, street, city)
VALUES
    (1234, '198804131234', 'Oskar', 'Art', 'Oskargatan', 'Oskarstaden'),
    (1234, '198906131111', 'Olle', 'Art', 'Oskargatan', 'Oskarstaden');

INSERT INTO Account
    (accountNr, balance)
VALUES
    ('1234567812345678', 100),
    ('1130491238512304', 14000);

INSERT INTO UserAccount
    (userId, accountId)
VALUES
    (1, 1),
    (2, 2),
    (1, 2);

