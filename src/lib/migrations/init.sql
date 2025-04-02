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
    keywords TEXT,
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
('admin1', 'admin1@example.com', '$2b$10$ginJV3UXV/dU/e4SraiVG.kbEGl3KtNxeMzJDWSijJ73qkLhuVM.i', 'admin'), -- password -> adminpassword
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

-- Insert sample media
INSERT INTO media (type, url) VALUES
('image', 'https://olsonja88.github.io/ICS499-Bears/assets/ballet1.jpg'), -- 1
('image', 'https://olsonja88.github.io/ICS499-Bears/assets/hiphop1.jpg'), -- 2
('image', 'https://olsonja88.github.io/ICS499-Bears/assets/salsa1.jpg'), -- 3
('image', 'https://olsonja88.github.io/ICS499-Bears/assets/tango1.jpg'), -- 4
('image', 'https://olsonja88.github.io/ICS499-Bears/assets/jazz1.jpg'), -- 5
('image', 'https://olsonja88.github.io/ICS499-Bears/assets/contemporary1.jpg'), -- 6
('image', 'https://olsonja88.github.io/ICS499-Bears/assets/bboy1.jpg'), -- 7
('image', 'https://olsonja88.github.io/ICS499-Bears/assets/flamenco1.jpg'), -- 8
('image', 'https://olsonja88.github.io/ICS499-Bears/assets/swing1.jpg'), -- 9
('video', 'https://olsonja88.github.io/ICS499-Bears/assets/dock-dance.mp4'), -- 10
('video', 'https://olsonja88.github.io/ICS499-Bears/assets/los-muertos.mp4'), -- 11 
('video', 'https://olsonja88.github.io/ICS499-Bears/assets/warehouse-breakdance.mp4'); -- 12

-- Insert sample dances
INSERT INTO dances (title, description, category_id, country_id, media_id, created_by) VALUES
('Swan Lake', 'A hallmark of classical ballet, Swan Lake is a romantic tale of tragic love, performed with precision and elegance. The choreography demands both technical mastery and emotional depth, with dancers portraying swans gliding across the stage with ethereal grace. Tchaikovsky’s iconic score swells beneath dramatic leaps, delicate pirouettes, and synchronized corps de ballet formations. The white swan, Odette, and the black swan, Odile, showcase stark contrast in character through movement — purity and melancholy versus seduction and cunning.', 1, 3, 1, 2), -- 1
('Dock Dance', 'Set on a weathered wooden dock near a shimmering lake, this contemporary freestyle piece blends breakdance footwork, hip-hop isolations, and rhythmic splashes with the serenity of nature. The dance uses the environment interactively — boards creak under foot, the water reflects the dancer’s motions, and seagulls punctuate transitions. Light foot taps mimic the sound of water dripping, while sudden freezes and body rolls give the illusion of riding the tide. It’s equal parts meditative and rebellious.', 7, 1, 10, 3), -- 2
('Street Popping', 'Street Popping is a funk-inspired dance style that emphasizes sharp contractions and smooth isolations. Dancers "pop" their muscles in rhythm to electric beats, creating a pulsating, robotic illusion. Movements alternate between fluid waves traveling through limbs and abrupt hits synced with basslines. Often performed in urban environments with graffiti backdrops and boomboxes blaring, this routine captures the essence of 1980s hip-hop battles — full of attitude, style, and freestyle expression.', 2, 1, 2, 5),
('Salsa Explosion', 'A vibrant and high-energy Latin dance, Salsa Explosion erupts with swift spins, body rolls, and sizzling footwork. Dancers twist, dip, and syncopate in tandem with upbeat Afro-Caribbean percussion. The choreography seamlessly shifts between tight partner work and expressive solo shines. With bold hip movements, rapid turns, and flirtatious eye contact, this performance is as much a celebration of connection as it is of rhythm. Bright costumes and contagious smiles heighten the electric atmosphere.', 3, 6, 3, 3), -- 3
('Los Muertos', 'Rooted in the traditions of Día de los Muertos, Los Muertos fuses folkloric Mexican dance with theatrical storytelling. Dancers adorned with calavera (skull) face paint and colorful marigolds move solemnly at first, honoring spirits through slow, grounded steps. As the tempo rises, so do their feet — with stomps, spins, and skirt flourishes evoking the joy of remembering loved ones. The performance blends reverence with celebration, embracing life and death in a heartfelt spectacle.', 10, 6, 11, 4), -- 4
('Passionate Tango', 'This sensual Argentine tango is fueled by tension, drama, and fiery intimacy. The dancers are locked in a tight embrace, moving as one entity across the stage with stalking steps and sharp flicks. Their gazes never break, communicating power dynamics and desire. Intricate leg entwines (ganchos), quick pivots (ochos), and sudden pauses build anticipation. The music’s bandoneón-driven pulse drives a choreography that tells a story of attraction, betrayal, and irresistible chemistry.', 4, 6, 4, 4), -- 5
('Broadway Jazz', 'Glamorous and theatrical, Broadway Jazz blends jazz dance technique with stage performance flair. The choreography features high kicks, shoulder rolls, and sassy struts — all exaggerated for the audience. Set to big-band show tunes or musical theater classics, dancers embody characters with over-the-top expressions and dramatic flair. Think Fosse-style isolation mixed with chorus-line unity, all shimmering under spotlight and sequins. It’s bold, bright, and brimming with showbiz energy.', 5, 1, 5, 6), -- 6
('Modern Flow', 'This contemporary-modern fusion emphasizes emotional storytelling through continuous motion. Modern Flow explores themes of release, resistance, and rebirth. Dancers sweep across the floor with grounded contractions, reaching lifts, and moments of suspension that defy gravity. Movements often emerge organically from breath, with an improvisational feel. Floorwork connects them to the earth, while spirals and weight shifts showcase vulnerability and strength. The mood is introspective, intimate, and deeply expressive.', 6, 10, 6, 7), -- 7
('B-boy Battle', 'A raw and explosive street dance, B-boy Battle is a showdown of strength, style, and swagger. Dancers throw down dynamic power moves like windmills, flares, and headspins, interspersed with stylized top rocks and creative freezes. It’s as much about originality as athleticism — each performer injects their personality into their set. The atmosphere is charged with energy, as crowds cheer and beatboxers fuel the rhythm. The ground becomes the canvas for gravity-defying artistry.', 7, 1, 7, 8), -- 8
('Flamenco Fiesta', 'A passionate Spanish folk dance, Flamenco Fiesta blends percussive footwork, intricate hand gestures (floreo), and intense emotion. Dancers strike poses with proud posture, stamping rhythmic patterns (zapateado) in dialogue with live guitar and clapping (palmas). Voluminous dresses twirl dramatically with each spin, while shawls and castanets accentuate the dancer’s expression. Flamenco’s spirit is fierce — channeling joy, sorrow, and defiance through every stomp and stare.', 8, 5, 8, 9), -- 9
('Swing Revival', 'Set to upbeat jazz and big band swing, Swing Revival reimagines vintage partner dancing with a modern twist. Dancers perform fast-paced Lindy Hop steps, Charleston kicks, and aerial lifts that harken back to the 1940s jitterbug era. It’s playful, fast, and full of personality — with couples breaking apart and reuniting in time with the brass section’s blast. The vibe is retro cool: suspenders, slicked-back hair, polka dots, and boundless energy.', 9, 1, 9, 10), -- 10
('Warehouse Breakdancing', 'In a gritty, industrial space with exposed brick and flickering fluorescent lights, dancers take over the warehouse with raw breakdancing power. Echoes of boom bap and reverb-rich beats guide them through windmills, air flares, and elbow freezes. The dust kicks up beneath their moves, spotlighting acrobatic solos and synchronized group routines. The setting adds weight to their defiance — transforming urban decay into a stage for creativity and rebellion.', 7, 1, 12, 11); -- 11


-- Insert sample comments
INSERT INTO comments (user_id, dance_id, content) VALUES
(1, 1, 'The grace and precision in this ballet piece is breathtaking!'),
(2, 2, 'Amazing breakdancing moves on that dock setting!'),
(3, 3, 'The hip-hop routine really shows off the street style!'),
(4, 4, 'Such a vibrant salsa performance - the energy is contagious!'),
(5, 5, 'Beautiful representation of Mexican folk traditions and culture!'),
(6, 6, 'The passion in this tango performance is undeniable!'),
(7, 7, 'Love how this jazz routine incorporates Broadway elements!'),
(8, 8, 'The fluidity in this contemporary piece is beautiful!'),
(9, 9, 'Incredible power moves in this b-boy battle!'),
(10, 10, 'The traditional flamenco footwork is so precise!'),
(9, 11, 'This swing dance really captures the spirit of the era!'),
(8, 12, 'The warehouse setting perfectly complements the breakdancing!'),
(7, 1, 'Such control and elegance in this ballet performance!'),
(6, 2, 'The breakdancing on the dock is so creative!'),
(5, 3, 'This hip-hop routine has such great energy!'),
(4, 4, 'The salsa rhythms are perfectly executed!'),
(3, 5, 'The costumes and movements really honor the Day of the Dead tradition!'),
(2, 6, 'The tango movements are so sharp and precise!');
