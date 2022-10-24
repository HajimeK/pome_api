CREATE TABLE IF NOT EXISTS experience (
    id SERIAL,
    title VARCHAR NOT NULL,
    note TEXT,
    urle VARCHAR,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tag (
    id SERIAL,
    tag VARCHAR(8) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT tag_unique UNIQUE (tag)
);

CREATE TABLE IF NOT EXISTS relexptag (
    id SERIAL,
    experience INT,
        FOREIGN KEY (experience)
        REFERENCES experience (id),
    tag INT,
        FOREIGN KEY (tag)
        REFERENCES tag (id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS appuser (
    id SERIAL,
    username VARCHAR,
    email VARCHAR,
    passwd VARCHAR,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS inquiry (
    id SERIAL,
    sender VARCHAR,
    title VARCHAR,
    note TEXT,
    PRIMARY KEY (id)
);