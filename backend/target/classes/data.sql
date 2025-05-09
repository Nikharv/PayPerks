-- Sample Cards Data
INSERT INTO cards_data (card_id, card_name, bank_name, card_type) VALUES
(1, 'Student Rewards Card', 'Chase', 'credit'),
(2, 'Freedom Unlimited', 'Chase', 'credit'),
(3, 'Student Cash Back', 'Discover', 'credit'),
(4, 'Student Debit', 'Bank of America', 'debit'),
(5, 'College Rewards', 'Citi', 'credit'),
(6, 'Student Life', 'Wells Fargo', 'debit');

-- Sample Offers Data
INSERT INTO offers_data (offer_id, card_id, merchant_id, merchant_name, card_name, offer_description) VALUES
(1, 1, 101, 'Amazon', 'Student Rewards Card', '5% cashback on all purchases'),
(2, 1, 102, 'Starbucks', 'Student Rewards Card', 'Buy one get one free on any drink'),
(3, 2, 103, 'Best Buy', 'Freedom Unlimited', '$50 off on purchases over $300'),
(4, 3, 104, 'Target', 'Student Cash Back', '10% off on school supplies'),
(5, 4, 105, 'Walmart', 'Student Debit', '5% off on groceries'),
(6, 5, 106, 'Apple', 'College Rewards', '$100 off on new MacBook'); 