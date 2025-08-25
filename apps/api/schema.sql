
-- Table: words
CREATE TABLE IF NOT EXISTS words (
	id INTEGER PRIMARY KEY,
	content TEXT,
	position TEXT,
	trans TEXT,
	en_sentence TEXT,
	vi_sentence TEXT
);

-- Table: saved
CREATE TABLE IF NOT EXISTS saved (
	id INTEGER PRIMARY KEY
);

