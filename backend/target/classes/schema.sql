-- Drop tables if they exist
DROP TABLE IF EXISTS claimed_offers;
DROP TABLE IF EXISTS offers_data;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS cards_data;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- Create cards_data table
CREATE TABLE cards_data (
    card_id INT PRIMARY KEY,
    card_name VARCHAR(100) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    card_type ENUM('credit', 'debit') NOT NULL
);

-- Create cards table
CREATE TABLE cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (card_id) REFERENCES cards_data(card_id),
    UNIQUE KEY unique_user_card (user_id, card_id)
);

-- Create offers_data table
CREATE TABLE offers_data (
    offer_id INT PRIMARY KEY,
    card_id INT NOT NULL,
    merchant_id INT NOT NULL,
    merchant_name VARCHAR(100) NOT NULL,
    card_name VARCHAR(100) NOT NULL,
    offer_description TEXT NOT NULL,
    FOREIGN KEY (card_id) REFERENCES cards_data(card_id)
);

-- Create claimed_offers table
CREATE TABLE claimed_offers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    offer_id INT NOT NULL,
    claimed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (offer_id) REFERENCES offers_data(offer_id),
    UNIQUE KEY unique_user_offer (user_id, offer_id)
); 