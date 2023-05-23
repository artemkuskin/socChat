create TABLE person(
    id SERIAL PRIMARY KEY,
    name  VARCHAR(255),
    surname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);

create TABLE token (
    accessToken VARCHAR(255),
    refreshToken VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);
