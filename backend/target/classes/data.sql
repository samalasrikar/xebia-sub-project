-- Seed default course (uses IGNORE to prevent duplicate key errors on already existing records)
INSERT IGNORE INTO course (id, title) VALUES ('c1', 'Cloud Native Engineering');

-- Seed default students
INSERT IGNORE INTO student (id, name, batch, status) VALUES ('s4', 'Jane Doe', 'B-2024-Q1', 'Active');
INSERT IGNORE INTO student (id, name, batch, status) VALUES ('s1', 'Alex Mercer', 'B-2023-Q4', 'Active');
