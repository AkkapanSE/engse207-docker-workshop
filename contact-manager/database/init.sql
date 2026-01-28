CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contacts (name, email, phone) VALUES 
    ('AKP1 Lead', 'akp1@email.com', '081-234-5678'),
    ('AKP2 Front', 'akp2@email.com', '089-876-5432'),
    ('AKP3 Back', 'akp3@email.com', '02-123-4567');