-- 
-- Create and use an own database for this example.
-- 
-- CREATE DATABASE Allan;
-- USE Allan;



-- 
-- Allans products that he sells
-- 
DROP TABLE IF EXISTS a_product;
CREATE TABLE a_product (
	`id` INTEGER PRIMARY KEY,
    `name` VARCHAR(20) 
);

INSERT INTO a_product
	VALUES
		(1, "Husqvarna"), (2, "Zündapp"), (3, "Puch Dakota"), (4, "Vespa");



-- 
-- Allans inventory, these products he has at home, ready to sell
-- 
DROP TABLE IF EXISTS a_inventory;
CREATE TABLE a_inventory (
	`id` INTEGER PRIMARY KEY,
    `number` INTEGER 
);

INSERT INTO a_inventory 
	VALUES
		(2, 2), (3, 3);




-- 
-- Allans supplier, these products exists at the supplier and can be soled with some delivery time
-- 
DROP TABLE IF EXISTS a_supplier;
CREATE TABLE a_supplier (
	`id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `number` INTEGER 
);

INSERT INTO a_supplier 
	VALUES
		(1, 4), (2, 3), (3, 2);
