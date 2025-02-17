-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'creator', 'viewer')) DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- Countries Table
CREATE TABLE IF NOT EXISTS countries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL
);

-- Dances Table
CREATE TABLE IF NOT EXISTS dances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    country_id INTEGER,
    media_id INTEGER,
    created_by INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Media Table (Videos, Images)
CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT CHECK(type IN ('image', 'video')) NOT NULL,
    url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    dance_id INTEGER,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dance_id) REFERENCES dances(id) ON DELETE CASCADE
);

-- User Roles (Optional - if multiple roles per user are needed)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER,
    role TEXT CHECK(role IN ('admin', 'creator', 'viewer')),
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (username, email, password_hash, role) VALUES
('admin1', 'admin1@example.com', 'hashedpassword1', 'admin'),
('creator1', 'creator1@example.com', 'hashedpassword2', 'creator'),
('viewer1', 'viewer1@example.com', 'hashedpassword3', 'viewer'),
('admin2', 'admin2@example.com', 'hashedpassword4', 'admin'),
('creator2', 'creator2@example.com', 'hashedpassword5', 'creator'),
('viewer2', 'viewer2@example.com', 'hashedpassword6', 'viewer'),
('creator3', 'creator3@example.com', 'hashedpassword7', 'creator'),
('viewer3', 'viewer3@example.com', 'hashedpassword8', 'viewer'),
('admin3', 'admin3@example.com', 'hashedpassword9', 'admin'),
('creator4', 'creator4@example.com', 'hashedpassword10', 'creator');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Ballet', 'A classical dance form demanding grace and precision.'),
('Hip-Hop', 'A high-energy dance style that includes breaking, popping, and locking.'),
('Salsa', 'A lively Latin dance that originated in the Caribbean.'),
('Tango', 'A passionate dance from Argentina.'),
('Jazz', 'A dance characterized by energy and improvisation.'),
('Contemporary', 'A dance style blending ballet and modern dance.'),
('Breakdance', 'A street dance style involving acrobatic moves.'),
('Flamenco', 'A traditional Spanish dance known for its dramatic flair.'),
('Swing', 'A dance style developed in the 1920s with lively movements.'),
('Folk', 'Traditional dances from various cultures.');

-- Insert sample countries
INSERT INTO countries (name, code) VALUES
('United States', 'USA'),
('United Kingdom', 'UK'),
('France', 'FRA'),
('Germany', 'GER'),
('Spain', 'ESP'),
('Argentina', 'ARG'),
('Brazil', 'BRA'),
('China', 'CHN'),
('Japan', 'JPN'),
('India', 'IND');

-- Insert sample dances
INSERT INTO dances (title, description, category_id, country_id, created_by) VALUES
('Swan Lake', 'A classic ballet performance.', 1, 3, 2),
('Street Popping', 'A freestyle hip-hop routine.', 2, 1, 5),
('Salsa Explosion', 'An energetic salsa performance.', 3, 6, 3),
('Passionate Tango', 'A fiery tango number.', 4, 6, 4),
('Broadway Jazz', 'A jazz routine with Broadway influences.', 5, 1, 6),
('Modern Flow', 'A contemporary dance performance.', 6, 10, 7),
('B-boy Battle', 'A competitive breakdancing event.', 7, 1, 8),
('Flamenco Fiesta', 'A traditional flamenco dance.', 8, 5, 9),
('Swing Revival', 'A lively swing dance.', 9, 1, 10);