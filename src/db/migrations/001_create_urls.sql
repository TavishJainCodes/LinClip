CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(20) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);