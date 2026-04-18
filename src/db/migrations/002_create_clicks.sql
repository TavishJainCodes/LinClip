CREATE TABLE IF NOT EXISTS clicks (
    id SERIAL PRIMARY KEY,
    sligid INTEGER REFERENCES urls(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    referrer TEXT
);