-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'creator', 'viewer')) DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- Countries Table
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL
);

-- Country Descriptions Table (for Google Gemini responses)
CREATE TABLE IF NOT EXISTS country_descriptions (
    id SERIAL PRIMARY KEY,
    country_id INTEGER UNIQUE NOT NULL,
    description TEXT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Media Table (Videos, Images)
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dances Table
CREATE TABLE IF NOT EXISTS dances (
    id SERIAL PRIMARY KEY,
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
-- https://www.worldometers.info/geography/alphabetical-list-of-countries/
-- list of countries in alphabetical order with #

INSERT INTO countries (name, code, lat, lng) VALUES
('Afghanistan', 'AF', 33.93911, 67.709953),
('Albania', 'AL', 41.153332, 20.168331),
('Algeria', 'DZ', 28.033886, 1.659626),
('Andorra', 'AD', 42.546245, 1.601554),
('Angola', 'AO', -11.202692, 17.873887),
('Antigua and Barbuda', 'AG', 17.060816, -61.796428),
('Argentina', 'AR', -38.416097, -63.616672),
('Armenia', 'AM', 40.069099, 45.038189),
('Australia', 'AU', -25.274398, 133.775136),
('Austria', 'AT', 47.516231, 14.550072),
('Azerbaijan', 'AZ', 40.143105, 47.576927),
('Bahamas', 'BS', 25.03428, -77.39628),
('Bahrain', 'BH', 25.930414, 50.637772),
('Bangladesh', 'BD', 23.684994, 90.356331),
('Barbados', 'BB', 13.193887, -59.543198),
('Belarus', 'BY', 53.709807, 27.953389),
('Belgium', 'BE', 50.503887, 4.469936),
('Belize', 'BZ', 17.189877, -88.49765),
('Benin', 'BJ', 9.30769, 2.315834),
('Bhutan', 'BT', 27.514162, 90.433601),
('Bolivia', 'BO', -16.290154, -63.588653),
('Bosnia and Herzegovina', 'BA', 43.915886, 17.679076),
('Botswana', 'BW', -22.328474, 24.684866),
('Brazil', 'BR', -14.235004, -51.92528),
('Brunei', 'BN', 4.535277, 114.727669),
('Bulgaria', 'BG', 42.733883, 25.48583),
('Burkina Faso', 'BF', 12.238333, -1.561593),
('Burundi', 'BI', -3.373056, 29.918886),
('Cabo Verde', 'CV', 16.002082, -24.013197),
('Cambodia', 'KH', 12.565679, 104.990963),
('Cameroon', 'CM', 7.369722, 12.354722),
('Canada', 'CA', 56.130366, -106.346771),
('Central African Republic', 'CF', 6.611111, 20.939444),
('Chad', 'TD', 15.454166, 18.732207),
('Chile', 'CL', -35.675147, -71.542969),
('China', 'CN', 35.86166, 104.195397),
('Colombia', 'CO', 4.570868, -74.297333),
('Comoros', 'KM', -11.875001, 43.872219),
('Congo (Congo-Brazzaville)', 'CG', -0.228021, 15.827659),
('Costa Rica', 'CR', 9.748917, -83.753428),
('Côte d''Ivoire', 'CI', 7.539989, -5.54708),
('Croatia', 'HR', 45.1, 15.2),
('Cuba', 'CU', 21.521757, -77.781167),
('Cyprus', 'CY', 35.126413, 33.429859),
('Czechia (Czech Republic)', 'CZ', 49.817492, 15.472962),
('Democratic Republic of the Congo', 'CD', -4.038333, 21.758664),
('Denmark', 'DK', 56.26392, 9.501785),
('Djibouti', 'DJ', 11.825138, 42.590275),
('Dominica', 'DM', 15.414999, -61.370976),
('Dominican Republic', 'DO', 18.735693, -70.162651),
('Ecuador', 'EC', -1.831239, -78.183406),
('Egypt', 'EG', 26.820553, 30.802498),
('El Salvador', 'SV', 13.794185, -88.89653),
('Equatorial Guinea', 'GQ', 1.650801, 10.267895),
('Eritrea', 'ER', 15.179384, 39.782334),
('Estonia', 'EE', 58.595272, 25.013607),
('Eswatini (fmr. "Swaziland")', 'SZ', -26.522503, 31.465866),
('Ethiopia', 'ET', 9.145, 40.489673),
('Fiji', 'FJ', -16.578193, 179.414413),
('Finland', 'FI', 61.92411, 25.748151),
('France', 'FR', 46.227638, 2.213749),
('Gabon', 'GA', -0.803689, 11.609444),
('Gambia', 'GM', 13.443182, -15.310139),
('Georgia', 'GE', 42.315407, 43.356892),
('Germany', 'DE', 51.165691, 10.451526),
('Ghana', 'GH', 7.946527, -1.023194),
('Greece', 'GR', 39.074208, 21.824312),
('Grenada', 'GD', 12.262776, -61.604171),
('Guatemala', 'GT', 15.783471, -90.230759),
('Guinea', 'GN', 9.945587, -9.696645),
('Guinea-Bissau', 'GW', 11.803749, -15.180413),
('Guyana', 'GY', 4.860416, -58.93018),
('Haiti', 'HT', 18.971187, -72.285215),
('Holy See (Vatican City State)', 'VA', 41.902916, 12.453389),
('Honduras', 'HN', 15.199999, -86.241905),
('Hungary', 'HU', 47.162494, 19.503304),
('Iceland', 'IS', 64.963051, -19.020835),
('India', 'IN', 20.593684, 78.96288),
('Indonesia', 'ID', -0.789275, 113.921327),
('Iran', 'IR', 32.427908, 53.688046),
('Iraq', 'IQ', 33.223191, 43.679291),
('Ireland', 'IE', 53.41291, -8.24389),
('Israel', 'IL', 31.046051, 34.851612),
('Italy', 'IT', 41.87194, 12.56738),
('Jamaica', 'JM', 18.109581, -77.297508),
('Japan', 'JP', 36.204824, 138.252924),
('Jordan', 'JO', 30.585164, 36.238414),
('Kazakhstan', 'KZ', 48.019573, 66.923684),
('Kenya', 'KE', -1.292066, 36.821945),
('Kiribati', 'KI', -3.370417, -168.734039),
('Kuwait', 'KW', 29.31166, 47.481766),
('Kyrgyzstan', 'KG', 41.20438, 74.766098),
('Laos', 'LA', 19.85627, 102.495496),
('Latvia', 'LV', 56.879635, 24.603189),
('Lebanon', 'LB', 33.854721, 35.862285),
('Lesotho', 'LS', -29.609988, 28.233608),
('Liberia', 'LR', 6.428055, -9.429499),
('Libya', 'LY', 26.3351, 17.228331),
('Liechtenstein', 'LI', 47.166, 9.555373),
('Lithuania', 'LT', 55.169438, 23.881275),
('Luxembourg', 'LU', 49.815273, 6.129583),
('Madagascar', 'MG', -18.766947, 46.869107),
('Malawi', 'MW', -13.254308, 34.301525),
('Malaysia', 'MY', 4.210484, 101.975766),
('Maldives', 'MV', 3.202778, 73.22068),
('Mali', 'ML', 17.570692, -3.996166),
('Malta', 'MT', 35.937496, 14.375416),
('Marshall Islands', 'MH', 7.131474, 171.184478),
('Mauritania', 'MR', 21.00789, -10.940835),
('Mauritius', 'MU', -20.348404, 57.552152),
('Mexico', 'MX', 23.634501, -102.552784),
('Micronesia', 'FM', 7.425554, 150.550812),
('Moldova', 'MD', 47.411631, 28.369885),
('Monaco', 'MC', 43.750298, 7.412841),
('Mongolia', 'MN', 46.862496, 103.846656),
('Montenegro', 'ME', 42.708678, 19.37439),
('Morocco', 'MA', 31.791702, -7.09262),
('Mozambique', 'MZ', -18.665695, 35.529562),
('Myanmar (formerly Burma)', 'MM', 21.916221, 95.955974),
('Namibia', 'NA', -22.95764, 18.49041),
('Nauru', 'NR', -0.522778, 166.931503),
('Nepal', 'NP', 28.394857, 84.124008),
('Netherlands', 'NL', 52.132633, 5.291266),
('New Zealand', 'NZ', -40.900557, 174.885971),
('Nicaragua', 'NI', 12.865416, -85.207229),
('Niger', 'NE', 17.607789, 8.081666),
('Nigeria', 'NG', 9.081999, 8.675277),
('North Korea', 'KP', 40.339852, 127.510093),
('North Macedonia', 'MK', 41.608635, 21.745275),
('Norway', 'NO', 60.472024, 8.468946),
('Oman', 'OM', 21.512583, 55.923255),
('Pakistan', 'PK', 30.375321, 69.345116),
('Palau', 'PW', 7.51498, 134.58252),
('Palestine State', 'PS', 31.952162, 35.233154),
('Panama', 'PA', 8.537981, -80.782127),
('Papua New Guinea', 'PG', -6.314993, 143.95555),
('Paraguay', 'PY', -23.442503, -58.443832),
('Peru', 'PE', -9.189967, -75.015152),
('Philippines', 'PH', 12.879721, 121.774017),
('Poland', 'PL', 51.919438, 19.145136),
('Portugal', 'PT', 39.399872, -8.224454),
('Qatar', 'QA', 25.354826, 51.183884),
('Romania', 'RO', 45.943161, 24.96676),
('Russia', 'RU', 61.52401, 105.318756),
('Rwanda', 'RW', -1.940278, 29.873888),
('Saint Kitts and Nevis', 'KN', 17.357822, -62.782998),
('Saint Lucia', 'LC', 13.909444, -60.978893),
('Saint Vincent and the Grenadines', 'VC', 12.984305, -61.287228),
('Samoa', 'WS', -13.759029, -172.104629),
('San Marino', 'SM', 43.933333, 12.45),
('Sao Tome and Principe', 'ST', 0.18636, 6.613081),
('Saudi Arabia', 'SA', 23.885942, 45.079162),
('Senegal', 'SN', 14.497401, -14.452362),
('Serbia', 'RS', 44.016521, 21.005859),
('Seychelles', 'SC', -4.679574, 55.491977),
('Sierra Leone', 'SL', 8.460555, -11.779889),
('Singapore', 'SG', 1.352083, 103.819836),
('Slovakia', 'SK', 48.669026, 19.699024),
('Slovenia', 'SI', 46.151241, 14.995463),
('Solomon Islands', 'SB', -9.64571, 160.156194),
('Somalia', 'SO', 5.152149, 46.199616),
('South Africa', 'ZA', -30.559482, 22.937506),
('South Korea', 'KR', 35.907757, 127.766922),
('South Sudan', 'SS', 6.877, 31.307),
('Spain', 'ES', 40.463667, -3.74922),
('Sri Lanka', 'LK', 7.873054, 80.771797),
('Sudan', 'SD', 12.862807, 30.217636),
('Suriname', 'SR', 3.919305, -56.027783),
('Sweden', 'SE', 60.128161, 18.643501),
('Switzerland', 'CH', 46.818188, 8.227512),
('Syria', 'SY', 34.802075, 38.996815),
('Tajikistan', 'TJ', 38.861034, 71.276093),
('Tanzania', 'TZ', -6.369028, 34.888822),
('Thailand', 'TH', 15.870032, 100.992541),
('Timor-Leste', 'TL', -8.874217, 125.727539),
('Togo', 'TG', 8.619543, 0.824782),
('Tonga', 'TO', -21.178986, -175.198242),
('Trinidad and Tobago', 'TT', 10.691803, -61.222503),
('Tunisia', 'TN', 33.886917, 9.537499),
('Turkey', 'TR', 38.963745, 35.243322),
('Turkmenistan', 'TM', 38.969719, 59.556278),
('Tuvalu', 'TV', -7.109535, 177.64933),
('Uganda', 'UG', 1.373333, 32.290275),
('Ukraine', 'UA', 48.379433, 31.16558),
('United Arab Emirates', 'AE', 23.424076, 53.847818),
('United Kingdom', 'GB', 55.378051, -3.435973),
('United States of America', 'US', 37.09024, -95.712891),
('Uruguay', 'UY', -32.522779, -55.765835),
('Uzbekistan', 'UZ', 41.377491, 64.585262),
('Vanuatu', 'VU', -15.376706, 166.959158),
('Venezuela', 'VE', 6.42375, -66.58973),
('Vietnam', 'VN', 14.058324, 108.277199),
('Yemen', 'YE', 15.552727, 48.516388),
('Zambia', 'ZM', -13.133897, 27.849332),
('Zimbabwe', 'ZW', -19.015438, 29.154857);

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
('Swan Lake', 'A hallmark of classical ballet, Swan Lake is a romantic tale of tragic love, performed with precision and elegance. The choreography demands both technical mastery and emotional depth, with dancers portraying swans gliding across the stage with ethereal grace. Tchaikovsky's iconic score swells beneath dramatic leaps, delicate pirouettes, and synchronized corps de ballet formations. The white swan, Odette, and the black swan, Odile, showcase stark contrast in character through movement — purity and melancholy versus seduction and cunning.', 1, 61, 1, 2), -- 1 france
('Dock Dance', 'Set on a weathered wooden dock near a shimmering lake, this contemporary freestyle piece blends breakdance footwork, hip-hop isolations, and rhythmic splashes with the serenity of nature. The dance uses the environment interactively — boards creak under foot, the water reflects the dancer's motions, and seagulls punctuate transitions. Light foot taps mimic the sound of water dripping, while sudden freezes and body rolls give the illusion of riding the tide. It's equal parts meditative and rebellious.', 7, 187, 10, 3), -- 2 usa
('Street Popping', 'Street Popping is a funk-inspired dance style that emphasizes sharp contractions and smooth isolations. Dancers "pop" their muscles in rhythm to electric beats, creating a pulsating, robotic illusion. Movements alternate between fluid waves traveling through limbs and abrupt hits synced with basslines. Often performed in urban environments with graffiti backdrops and boomboxes blaring, this routine captures the essence of 1980s hip-hop battles — full of attitude, style, and freestyle expression.', 2, 187, 2, 5), -- usa
('Salsa Explosion', 'A vibrant and high-energy Latin dance, Salsa Explosion erupts with swift spins, body rolls, and sizzling footwork. Dancers twist, dip, and syncopate in tandem with upbeat Afro-Caribbean percussion. The choreography seamlessly shifts between tight partner work and expressive solo shines. With bold hip movements, rapid turns, and flirtatious eye contact, this performance is as much a celebration of connection as it is of rhythm. Bright costumes and contagious smiles heighten the electric atmosphere.', 3, 7, 3, 3), -- 3 argentina
('Los Muertos', 'Rooted in the traditions of Día de los Muertos, Los Muertos fuses folkloric Mexican dance with theatrical storytelling. Dancers adorned with calavera (skull) face paint and colorful marigolds move solemnly at first, honoring spirits through slow, grounded steps. As the tempo rises, so do their feet — with stomps, spins, and skirt flourishes evoking the joy of remembering loved ones. The performance blends reverence with celebration, embracing life and death in a heartfelt spectacle.', 10, 7, 11, 4), -- 4 argentina 
('Passionate Tango', 'This sensual Argentine tango is fueled by tension, drama, and fiery intimacy. The dancers are locked in a tight embrace, moving as one entity across the stage with stalking steps and sharp flicks. Their gazes never break, communicating power dynamics and desire. Intricate leg entwines (ganchos), quick pivots (ochos), and sudden pauses build anticipation. The music's bandoneón-driven pulse drives a choreography that tells a story of attraction, betrayal, and irresistible chemistry.', 4, 7, 4, 4), -- 5 argentina
('Broadway Jazz', 'Glamorous and theatrical, Broadway Jazz blends jazz dance technique with stage performance flair. The choreography features high kicks, shoulder rolls, and sassy struts — all exaggerated for the audience. Set to big-band show tunes or musical theater classics, dancers embody characters with over-the-top expressions and dramatic flair. Think Fosse-style isolation mixed with chorus-line unity, all shimmering under spotlight and sequins. It's bold, bright, and brimming with showbiz energy.', 5, 187, 5, 6), -- 6 usa
('Modern Flow', 'This contemporary-modern fusion emphasizes emotional storytelling through continuous motion. Modern Flow explores themes of release, resistance, and rebirth. Dancers sweep across the floor with grounded contractions, reaching lifts, and moments of suspension that defy gravity. Movements often emerge organically from breath, with an improvisational feel. Floorwork connects them to the earth, while spirals and weight shifts showcase vulnerability and strength. The mood is introspective, intimate, and deeply expressive.', 6, 78, 6, 7), -- 7 india
('B-boy Battle', 'A raw and explosive street dance, B-boy Battle is a showdown of strength, style, and swagger. Dancers throw down dynamic power moves like windmills, flares, and headspins, interspersed with stylized top rocks and creative freezes. It's as much about originality as athleticism — each performer injects their personality into their set. The atmosphere is charged with energy, as crowds cheer and beatboxers fuel the rhythm. The ground becomes the canvas for gravity-defying artistry.', 7, 187, 7, 8), -- 8 usa
('Flamenco Fiesta', 'A passionate Spanish folk dance, Flamenco Fiesta blends percussive footwork, intricate hand gestures (floreo), and intense emotion. Dancers strike poses with proud posture, stamping rhythmic patterns (zapateado) in dialogue with live guitar and clapping (palmas). Voluminous dresses twirl dramatically with each spin, while shawls and castanets accentuate the dancer's expression. Flamenco's spirit is fierce — channeling joy, sorrow, and defiance through every stomp and stare.', 8, 165, 8, 9), -- 9 spain
('Swing Revival', 'Set to upbeat jazz and big band swing, Swing Revival reimagines vintage partner dancing with a modern twist. Dancers perform fast-paced Lindy Hop steps, Charleston kicks, and aerial lifts that harken back to the 1940s jitterbug era. It's playful, fast, and full of personality — with couples breaking apart and reuniting in time with the brass section's blast. The vibe is retro cool: suspenders, slicked-back hair, polka dots, and boundless energy.', 9, 187, 9, 10), -- 10 usa 
('Warehouse Breakdancing', 'In a gritty, industrial space with exposed brick and flickering fluorescent lights, dancers take over the warehouse with raw breakdancing power. Echoes of boom bap and reverb-rich beats guide them through windmills, air flares, and elbow freezes. The dust kicks up beneath their moves, spotlighting acrobatic solos and synchronized group routines. The setting adds weight to their defiance — transforming urban decay into a stage for creativity and rebellion.', 7, 187, 12, 11); -- 11 usa


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
