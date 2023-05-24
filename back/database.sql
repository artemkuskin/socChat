create TABLE person(
    id SERIAL PRIMARY KEY,
    name  VARCHAR(555),
    surname VARCHAR(555),
    email VARCHAR(555),
    password VARCHAR(555),
    activationLink TEXT,
    isActivated BOOLEAN DEFAULT false
);

create TABLE token (
    accessToken VARCHAR(555),
    refreshToken VARCHAR(555),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);
