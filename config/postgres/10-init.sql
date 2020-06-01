CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    oauth_id text UNIQUE NOT NULL,
    display_name text,
    profile_image text,
    created_at timestamp without time zone default (timezone('utc', now())),
    oauth_provider varchar(20) NOT NULL,
    raw text
);

CREATE TABLE IF NOT EXISTS phrases (
    user_id uuid REFERENCES users(user_id),
    phrase_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    phrase text NOT NULL,
    created_at timestamp without time zone default (timezone('utc', now())),
    deleted boolean DEFAULT false,
    deleted_at timestamp without time zone,
    visible boolean DEFAULT true
);
